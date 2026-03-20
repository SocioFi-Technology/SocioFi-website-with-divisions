'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

const A = '#4DBFA8';

const STYLES = `
  @keyframes svcPulse {
    0%, 100% { opacity: 0.7; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.15); }
  }

  .pl-hero {
    position: relative;
    padding: 160px 0 100px;
    background: var(--bg);
    overflow: hidden;
    text-align: center;
  }
  .pl-orb-a {
    position: absolute;
    width: 700px; height: 700px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(77,191,168,0.09) 0%, transparent 65%);
    top: -280px; left: 50%;
    transform: translateX(-50%);
    pointer-events: none;
    animation: svcPulse 9s ease-in-out infinite;
  }
  .pl-orb-b {
    position: absolute;
    width: 400px; height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(58,88,158,0.08) 0%, transparent 65%);
    bottom: -60px; right: 10%;
    pointer-events: none;
    animation: svcPulse 11s ease-in-out infinite 3s;
  }

  .pl-wrap { max-width: 1200px; margin: 0 auto; padding: 0 32px; }
  @media (max-width: 768px) { .pl-wrap { padding: 0 20px; } }

  .pl-mono-label {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    font-weight: 500;
    color: ${A};
    text-transform: uppercase;
    letter-spacing: 0.12em;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
  }
  .pl-mono-label::before, .pl-mono-label::after {
    content: ''; width: 20px; height: 1.5px; background: ${A};
  }

  .pl-sec-label {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    font-weight: 500;
    color: ${A};
    text-transform: uppercase;
    letter-spacing: 0.12em;
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 14px;
  }
  .pl-sec-label::before { content: ''; width: 20px; height: 1.5px; background: ${A}; }

  .pl-h1 {
    font-family: var(--font-headline);
    font-size: clamp(2.4rem, 4.5vw, 3.8rem);
    font-weight: 800;
    line-height: 1.07;
    letter-spacing: -0.033em;
    color: var(--text-primary);
    margin: 0 auto 20px;
    max-width: 800px;
  }
  .pl-h2 {
    font-family: var(--font-headline);
    font-size: clamp(1.8rem, 3vw, 2.4rem);
    font-weight: 700;
    line-height: 1.15;
    letter-spacing: -0.02em;
    color: var(--text-primary);
    margin: 0 0 16px;
  }
  .pl-hero-sub {
    font-family: var(--font-body);
    font-size: 1.05rem;
    line-height: 1.7;
    color: var(--text-secondary);
    max-width: 540px;
    margin: 0 auto 28px;
  }
  .pl-grad {
    background: linear-gradient(135deg, #4A6CB8, ${A});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .pl-ceo-quote {
    max-width: 600px;
    margin: 0 auto;
    padding: 24px 28px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-left: 3px solid ${A};
    border-radius: var(--radius-md);
    text-align: left;
  }
  .pl-ceo-quote p {
    font-family: var(--font-body);
    font-size: 0.95rem;
    line-height: 1.65;
    color: var(--text-secondary);
    font-style: italic;
    margin: 0 0 12px;
  }
  .pl-ceo-by {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    color: ${A};
    letter-spacing: 0.06em;
  }

  .pl-btn-row { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; margin-bottom: 40px; }
  .pl-btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 14px 28px;
    background: ${A}; color: #fff;
    font-family: var(--font-headline); font-size: 0.9rem; font-weight: 600; letter-spacing: -0.01em;
    border-radius: var(--radius-full); text-decoration: none;
    transition: all 0.25s var(--ease);
    box-shadow: 0 4px 24px rgba(77,191,168,0.3);
  }
  .pl-btn-primary:hover { transform: translateY(-3px) scale(1.03); box-shadow: 0 10px 40px rgba(77,191,168,0.5); }
  .pl-btn-ghost {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 14px 28px;
    background: transparent; color: var(--text-primary);
    font-family: var(--font-headline); font-size: 0.9rem; font-weight: 600; letter-spacing: -0.01em;
    border-radius: var(--radius-full); border: 1.5px solid var(--border);
    text-decoration: none; transition: all 0.25s var(--ease);
  }
  .pl-btn-ghost:hover { border-color: ${A}; color: ${A}; }

  /* ── Plans Section ── */
  .pl-plans-sec { padding: 100px 0; background: var(--bg-2); }
  .pl-plans-header { text-align: center; margin-bottom: 56px; }
  .pl-plans-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    align-items: start;
  }
  @media (max-width: 1024px) { .pl-plans-grid { grid-template-columns: 1fr; max-width: 540px; margin: 0 auto; } }

  .pl-plan-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 36px;
    position: relative;
    overflow: hidden;
    transition: all 0.4s var(--ease);
    box-shadow: var(--card-shadow);
  }
  .pl-plan-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--navy), ${A});
    opacity: 0; transition: opacity 0.4s;
  }
  .pl-plan-card:hover { transform: translateY(-6px); box-shadow: var(--card-hover-shadow); border-color: var(--border-hover); }
  .pl-plan-card:hover::before { opacity: 1; }

  .pl-plan-featured {
    border-color: rgba(77,191,168,0.35);
    box-shadow: 0 0 40px rgba(77,191,168,0.10);
  }
  .pl-plan-featured::before { opacity: 1 !important; }

  .pl-popular-badge {
    position: absolute; top: 20px; right: 20px;
    font-family: var(--font-mono);
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: var(--radius-full);
    background: rgba(77,191,168,0.15);
    color: ${A};
    border: 1px solid rgba(77,191,168,0.3);
  }

  .pl-plan-name {
    font-family: var(--font-headline);
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 8px;
    letter-spacing: -0.01em;
  }
  .pl-plan-tagline {
    font-family: var(--font-body);
    font-size: 0.84rem;
    color: var(--text-muted);
    margin: 0 0 24px;
    line-height: 1.5;
  }
  .pl-plan-audience {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--text-muted);
    margin: 0 0 24px;
    padding: 6px 0;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    letter-spacing: 0.03em;
  }

  .pl-plan-price {
    display: flex;
    align-items: baseline;
    gap: 4px;
    margin-bottom: 6px;
  }
  .pl-plan-amount {
    font-family: var(--font-headline);
    font-size: 2.8rem;
    font-weight: 800;
    letter-spacing: -0.04em;
    color: var(--text-primary);
    line-height: 1;
  }
  .pl-plan-period {
    font-family: var(--font-body);
    font-size: 0.9rem;
    color: var(--text-muted);
  }
  .pl-plan-note {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--text-muted);
    margin-bottom: 28px;
  }

  .pl-plan-sla {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
    flex-wrap: wrap;
  }
  .pl-sla-item {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    padding: 4px 10px;
    border-radius: var(--radius-full);
    background: rgba(77,191,168,0.07);
    border: 1px solid rgba(77,191,168,0.14);
    color: ${A};
    letter-spacing: 0.04em;
  }

  .pl-plan-features {
    list-style: none;
    padding: 0; margin: 0 0 28px;
    display: flex; flex-direction: column; gap: 10px;
  }
  .pl-plan-features li {
    display: flex; align-items: flex-start; gap: 10px;
    font-family: var(--font-body);
    font-size: 0.88rem;
    line-height: 1.55;
    color: var(--text-secondary);
  }
  .pl-check {
    width: 16px; height: 16px; min-width: 16px;
    border-radius: 50%;
    background: rgba(77,191,168,0.12);
    display: flex; align-items: center; justify-content: center;
    margin-top: 2px;
  }
  .pl-check-featured {
    background: rgba(77,191,168,0.18);
  }

  .pl-plan-not {
    margin-bottom: 28px;
  }
  .pl-plan-not-title {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 10px;
  }
  .pl-plan-not-list {
    list-style: none;
    padding: 0; margin: 0;
    display: flex; flex-direction: column; gap: 7px;
  }
  .pl-plan-not-list li {
    display: flex; align-items: flex-start; gap: 8px;
    font-family: var(--font-body);
    font-size: 0.82rem;
    line-height: 1.5;
    color: var(--text-muted);
  }
  .pl-x-icon {
    width: 14px; height: 14px; min-width: 14px;
    margin-top: 2px; opacity: 0.45;
  }

  .pl-plan-cta {
    display: block;
    text-align: center;
    padding: 13px 24px;
    border-radius: var(--radius-full);
    font-family: var(--font-headline);
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    text-decoration: none;
    transition: all 0.25s var(--ease);
  }
  .pl-cta-default {
    background: transparent;
    color: var(--text-primary);
    border: 1.5px solid var(--border);
  }
  .pl-cta-default:hover { border-color: ${A}; color: ${A}; }
  .pl-cta-featured {
    background: ${A};
    color: #fff;
    box-shadow: 0 4px 20px rgba(77,191,168,0.3);
  }
  .pl-cta-featured:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(77,191,168,0.45); }

  /* ── Plan Recommender ── */
  .pl-rec-sec { padding: 100px 0; background: var(--bg); }
  .pl-rec-header { text-align: center; margin-bottom: 56px; }
  .pl-rec-card {
    max-width: 760px;
    margin: 0 auto;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    padding: 48px;
    box-shadow: var(--card-shadow);
  }
  @media (max-width: 768px) { .pl-rec-card { padding: 28px 24px; } }

  .pl-rec-progress {
    display: flex;
    gap: 8px;
    margin-bottom: 36px;
  }
  .pl-rec-dot {
    flex: 1;
    height: 3px;
    border-radius: 2px;
    background: var(--border);
    transition: background 0.3s;
  }
  .pl-rec-dot-active { background: ${A}; }

  .pl-rec-q-label {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: ${A};
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 12px;
  }
  .pl-rec-q {
    font-family: var(--font-headline);
    font-size: 1.4rem;
    font-weight: 700;
    letter-spacing: -0.015em;
    color: var(--text-primary);
    margin: 0 0 28px;
    line-height: 1.3;
  }
  .pl-rec-options {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 32px;
  }
  @media (max-width: 640px) { .pl-rec-options { grid-template-columns: 1fr; } }
  .pl-rec-opt {
    padding: 14px 18px;
    border-radius: var(--radius-md);
    border: 1.5px solid var(--border);
    background: transparent;
    color: var(--text-primary);
    font-family: var(--font-body);
    font-size: 0.92rem;
    cursor: pointer;
    transition: all 0.2s var(--ease);
    text-align: left;
    line-height: 1.45;
  }
  .pl-rec-opt:hover { border-color: ${A}; color: ${A}; }
  .pl-rec-opt-selected {
    border-color: ${A} !important;
    background: rgba(77,191,168,0.08) !important;
    color: ${A} !important;
  }

  .pl-rec-result {
    background: var(--bg-2);
    border: 1.5px solid rgba(77,191,168,0.25);
    border-radius: var(--radius-lg);
    padding: 28px 32px;
    margin-top: 8px;
  }
  .pl-rec-result-label {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 8px;
  }
  .pl-rec-result-plan {
    font-family: var(--font-headline);
    font-size: 1.5rem;
    font-weight: 800;
    color: ${A};
    margin: 0 0 10px;
    letter-spacing: -0.02em;
  }
  .pl-rec-result-reason {
    font-family: var(--font-body);
    font-size: 0.9rem;
    line-height: 1.65;
    color: var(--text-secondary);
    margin: 0 0 20px;
  }
  .pl-rec-reset {
    background: transparent;
    border: none;
    font-family: var(--font-mono);
    font-size: 0.72rem;
    color: var(--text-muted);
    cursor: pointer;
    letter-spacing: 0.05em;
    padding: 0;
    text-decoration: underline;
    margin-left: 16px;
    transition: color 0.2s;
  }
  .pl-rec-reset:hover { color: ${A}; }

  /* ── Add-ons ── */
  .pl-addons-sec { padding: 100px 0; background: var(--bg-2); }
  .pl-addons-header { text-align: center; margin-bottom: 56px; }
  .pl-addons-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  @media (max-width: 1024px) { .pl-addons-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 640px) { .pl-addons-grid { grid-template-columns: 1fr; } }

  .pl-addon-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 28px;
    transition: all 0.4s var(--ease);
    box-shadow: var(--card-shadow);
  }
  .pl-addon-card:hover { transform: translateY(-4px); box-shadow: var(--card-hover-shadow); border-color: var(--border-hover); }

  .pl-addon-price {
    font-family: var(--font-headline);
    font-size: 1.3rem;
    font-weight: 800;
    color: ${A};
    margin-bottom: 4px;
    letter-spacing: -0.02em;
  }
  .pl-addon-freq {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--text-muted);
    margin-bottom: 14px;
  }
  .pl-addon-title {
    font-family: var(--font-headline);
    font-size: 1rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 8px;
    letter-spacing: -0.01em;
  }
  .pl-addon-desc {
    font-family: var(--font-body);
    font-size: 0.84rem;
    line-height: 1.6;
    color: var(--text-secondary);
    margin: 0;
  }

  /* ── Comparison Table ── */
  .pl-table-sec { padding: 100px 0; background: var(--bg); }
  .pl-table-header { text-align: center; margin-bottom: 56px; }
  .pl-table-wrap { overflow-x: auto; }
  .pl-table {
    width: 100%;
    border-collapse: collapse;
    font-family: var(--font-body);
    font-size: 0.88rem;
  }
  .pl-table th {
    font-family: var(--font-headline);
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--text-primary);
    padding: 16px 20px;
    text-align: left;
    border-bottom: 2px solid var(--border);
    white-space: nowrap;
  }
  .pl-table th:first-child { min-width: 200px; }
  .pl-table th:not(:first-child) { text-align: center; min-width: 140px; }
  .pl-table td {
    padding: 13px 20px;
    border-bottom: 1px solid var(--border);
    color: var(--text-secondary);
    line-height: 1.45;
  }
  .pl-table td:not(:first-child) { text-align: center; }
  .pl-table-highlight { background: rgba(77,191,168,0.04); }
  .pl-table-cat td {
    background: var(--bg-2);
    font-family: var(--font-mono);
    font-size: 0.68rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: ${A};
    padding: 10px 20px;
  }
  .pl-table-check { color: ${A}; }
  .pl-table-x { color: var(--text-muted); opacity: 0.5; }
  .pl-table tr:last-child td { border-bottom: none; }

  /* ── Cost Compare ── */
  .pl-compare-sec { padding: 100px 0; background: var(--bg-2); }
  .pl-compare-header { text-align: center; margin-bottom: 56px; }
  .pl-compare-table-wrap { overflow-x: auto; }
  .pl-compare-table {
    width: 100%;
    border-collapse: collapse;
    font-family: var(--font-body);
    font-size: 0.88rem;
  }
  .pl-compare-table th {
    font-family: var(--font-headline);
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--text-primary);
    padding: 14px 20px;
    text-align: center;
    border-bottom: 2px solid var(--border);
  }
  .pl-compare-table th:first-child { text-align: left; }
  .pl-compare-table td {
    padding: 14px 20px;
    border-bottom: 1px solid var(--border);
    color: var(--text-secondary);
    text-align: center;
    line-height: 1.45;
  }
  .pl-compare-table td:first-child { text-align: left; font-weight: 500; color: var(--text-primary); }
  .pl-compare-highlight { background: rgba(77,191,168,0.05); }
  .pl-compare-highlight td { color: ${A}; font-weight: 500; }
  .pl-compare-table tr:last-child td { border-bottom: none; }

  /* ── FAQ ── */
  .pl-faq-sec { padding: 100px 0; background: var(--bg); }
  .pl-faq-header { text-align: center; margin-bottom: 56px; }
  .pl-faq-list { max-width: 760px; margin: 0 auto; display: flex; flex-direction: column; gap: 2px; }

  .pl-faq-item {
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    overflow: hidden;
    transition: border-color 0.3s;
  }
  .pl-faq-item-open { border-color: rgba(77,191,168,0.25); }

  .pl-faq-q {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 20px 24px;
    background: transparent;
    border: none;
    text-align: left;
    cursor: pointer;
    gap: 16px;
    font-family: var(--font-headline);
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    letter-spacing: -0.01em;
    line-height: 1.35;
    transition: color 0.2s;
  }
  .pl-faq-q:hover { color: ${A}; }
  .pl-faq-icon {
    width: 20px; height: 20px; min-width: 20px;
    border-radius: 50%;
    background: rgba(77,191,168,0.08);
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s, transform 0.3s var(--ease);
    color: ${A};
  }
  .pl-faq-icon-open { transform: rotate(45deg); background: rgba(77,191,168,0.15); }
  .pl-faq-a {
    padding: 0 24px 20px;
    font-family: var(--font-body);
    font-size: 0.9rem;
    line-height: 1.7;
    color: var(--text-secondary);
  }

  /* ── CTA ── */
  .pl-cta-sec { padding: 100px 0; background: var(--bg-2); text-align: center; position: relative; overflow: hidden; }
  .pl-cta-orb {
    position: absolute;
    width: 700px; height: 700px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(77,191,168,0.07) 0%, transparent 65%);
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }
  .pl-cta-inner { position: relative; z-index: 1; }
  .pl-cta-h2 {
    font-family: var(--font-headline);
    font-size: clamp(1.7rem, 2.8vw, 2.4rem);
    font-weight: 800;
    letter-spacing: -0.025em;
    color: var(--text-primary);
    margin: 0 0 16px;
  }
  .pl-cta-sub {
    font-family: var(--font-body);
    font-size: 1rem;
    line-height: 1.65;
    color: var(--text-secondary);
    max-width: 480px;
    margin: 0 auto 36px;
  }
  .pl-cta-note {
    font-family: var(--font-mono);
    font-size: 0.78rem;
    color: var(--text-muted);
    margin-top: 20px;
    letter-spacing: 0.02em;
  }
  .sec-body-sub {
    font-family: var(--font-body);
    font-size: 1rem;
    color: var(--text-secondary);
    line-height: 1.65;
    max-width: 520px;
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    .pl-hero { padding: 120px 0 80px; }
    .pl-plans-sec, .pl-rec-sec, .pl-addons-sec, .pl-table-sec,
    .pl-compare-sec, .pl-faq-sec, .pl-cta-sec { padding: 80px 0; }
  }
`;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (d = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: d, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
  })
};

// ── Plan Recommender ──────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    id: 'customers',
    label: 'QUESTION 1 OF 4',
    q: 'How many active customers does your product have?',
    options: ['Under 1,000', '1,000 – 10,000', '10,000 – 50,000', 'More than 50,000'],
  },
  {
    id: 'uptime',
    label: 'QUESTION 2 OF 4',
    q: 'How critical is uptime for your business?',
    options: ['Nice to have — some downtime is okay', 'Important — customers would notice', 'Mission-critical — every minute costs money', 'Revenue-stopping — we need 24/7 coverage'],
  },
  {
    id: 'features',
    label: 'QUESTION 3 OF 4',
    q: 'Do you need new features or improvements built?',
    options: ['No — just keep it stable', 'Occasionally — once a quarter maybe', 'Yes — monthly improvements are important', 'Yes — we need a steady pace of development'],
  },
  {
    id: 'agents',
    label: 'QUESTION 4 OF 4',
    q: 'Are you running AI agents in your product?',
    options: ['No AI agents', 'Planning to add AI agents', 'Yes — built by SocioFi', 'Yes — custom or third-party agents'],
  },
];

function getRecommendation(answers: string[]): { plan: string; reason: string } {
  const [c, u, f, a] = answers;
  const highCustomers = c === '10,000 – 50,000' || c === 'More than 50,000';
  const missionCritical = u === 'Mission-critical — every minute costs money' || u === 'Revenue-stopping — we need 24/7 coverage';
  const needsFeatures = f === 'Yes — monthly improvements are important' || f === 'Yes — we need a steady pace of development';
  const hasAgents = a === 'Yes — built by SocioFi' || a === 'Yes — custom or third-party agents';

  if (missionCritical || highCustomers || (needsFeatures && hasAgents)) {
    return {
      plan: 'Scale — $1,999/month',
      reason: `Based on your answers, you need 24/7 coverage, high reliability, and ${hasAgents ? 'agent monitoring' : 'mission-critical uptime'}. Scale gives you a dedicated engineer, sub-1hr response, and continuous optimization.`,
    };
  }
  if (c === '1,000 – 10,000' || needsFeatures || u === 'Important — customers would notice' || hasAgents) {
    return {
      plan: 'Growth — $999/month',
      reason: `Growth fits your stage: you have real users depending on you, ${needsFeatures ? 'want to keep building' : 'need reliable uptime'}, and${hasAgents ? ' AI agents that need oversight' : ' want a team watching your back'}. Unlimited bug fixes, 4 feature hours, dedicated Slack.`,
    };
  }
  return {
    plan: 'Essential — $499/month',
    reason: "You're at an early stage where solid monitoring and security coverage is the priority. Essential keeps your software protected without paying for capabilities you don't need yet. Upgrade any time.",
  };
}

function PlanRecommender() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const done = answers.length === QUESTIONS.length;

  function handleSelect(opt: string) {
    setSelected(opt);
  }
  function handleNext() {
    if (!selected) return;
    const next = [...answers, selected];
    setAnswers(next);
    setSelected(null);
    if (step < QUESTIONS.length - 1) setStep(step + 1);
  }
  function reset() {
    setStep(0);
    setAnswers([]);
    setSelected(null);
  }

  const rec = done ? getRecommendation(answers) : null;
  const q = QUESTIONS[step];

  return (
    <div className="pl-rec-card">
      <div className="pl-rec-progress">
        {QUESTIONS.map((_, i) => (
          <div key={i} className={`pl-rec-dot ${i <= (done ? QUESTIONS.length - 1 : step) ? 'pl-rec-dot-active' : ''}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <p className="pl-rec-q-label">{q.label}</p>
            <p className="pl-rec-q">{q.q}</p>
            <div className="pl-rec-options">
              {q.options.map((opt) => (
                <button
                  key={opt}
                  className={`pl-rec-opt ${selected === opt ? 'pl-rec-opt-selected' : ''}`}
                  onClick={() => handleSelect(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={handleNext}
                disabled={!selected}
                style={{
                  padding: '12px 24px',
                  borderRadius: 'var(--radius-full)',
                  background: selected ? A : 'var(--border)',
                  color: selected ? '#fff' : 'var(--text-muted)',
                  border: 'none',
                  fontFamily: 'var(--font-headline)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: selected ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s var(--ease)',
                }}
              >
                {step === QUESTIONS.length - 1 ? 'Get Recommendation' : 'Next'}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="pl-rec-q-label">RECOMMENDED FOR YOU</p>
            <div className="pl-rec-result">
              <p className="pl-rec-result-label">Based on your answers, we&apos;d suggest:</p>
              <p className="pl-rec-result-plan">{rec!.plan}</p>
              <p className="pl-rec-result-reason">{rec!.reason}</p>
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <Link
                  href={`/services/get-protected?plan=${rec!.plan.split(' ')[0].toLowerCase()}`}
                  className="pl-btn-primary"
                  style={{ fontSize: '0.85rem', padding: '11px 22px' }}
                >
                  Choose {rec!.plan.split(' ')[0]}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
                <button className="pl-rec-reset" onClick={reset}>Start over</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── FAQ Accordion ─────────────────────────────────────────────────────────────
const FAQS = [
  { q: "Can I start on Essential and upgrade later?", a: "Yes — upgrade any time, even mid-cycle. Upgrading mid-month is prorated so you only pay for the days on the new plan. Your monitoring config, documentation, and history carry over with no disruption." },
  { q: "Essential says 5 bug fixes per month. What counts as a bug fix?", a: "A bug is existing behavior that is broken or incorrect — login not working, data not saving, a page throwing a 500 error. A bug fix allocation covers the diagnostic, the fix, and the deployment. Feature requests, UI improvements, and new integrations are not bugs." },
  { q: "What's the difference between a bug fix and a feature hour?", a: "Bug fixes address broken behavior. Feature hours are for improvements, new pages, additional integrations, or changes to how the product works. Essential covers bug fixes only. Growth includes 4 feature hours per month; Scale includes 10." },
  { q: "Does SocioFi Services cover my hosting costs?", a: "No — hosting fees go to your hosting provider (Vercel, AWS, Railway, etc.). We manage your infrastructure configuration, optimize your costs, and handle incidents, but we don't pay your hosting bills." },
  { q: "My software wasn't built by SocioFi. Can I still sign up?", a: "Absolutely. The majority of our clients come to us with software built by agencies, freelancers, or themselves. We start with a $399 codebase audit to understand your system, then begin protection from there. The audit fee is credited to your first plan month." },
  { q: "What is AI agent monitoring?", a: "If your product runs AI agents — automated workflows, LLM-powered features, classification pipelines — we monitor for model drift, unexpected outputs, cost spikes, and performance degradation. Growth includes basic agent monitoring; Scale includes full agent oversight with drift detection and retraining alerts." },
  { q: "Can I use feature hours for anything?", a: "Feature hours can be used for any development work within your existing codebase: new pages, API integrations, UI improvements, performance work, or new functionality. Anything requiring significant architecture changes or a new product area is scoped separately before any work starts." },
  { q: "Is there a long-term contract?", a: "No. All plans are month-to-month. Cancel before your next billing date and you won't be charged for the following month. We'll send a final handover document with everything we built, fixed, and documented during your time with us." },
  { q: "What's your refund policy?", a: "If you're unsatisfied in your first month, we'll work to resolve the issue. If we genuinely can't meet your needs, we'll refund the first month. After month one, no refunds — but you can cancel any time before your next billing date." },
  { q: "Can I protect multiple products under one plan?", a: "Each plan covers a single production application. If you have two separate products, each needs its own plan. We do offer a small discount for multiple active plans from the same company — mention it when you sign up." },
  { q: "Do you work on weekends?", a: "Automated monitoring runs 24/7/365. Critical alerts (production down, data breach) are responded to on Essential within 8 hours regardless of when they happen. Growth is 4-hour response business hours. Scale includes 24/7 response with under-1-hour SLA including weekends." },
  { q: "What tech stacks do you support?", a: "We work with the stacks we build with: Next.js, React, Node.js, Python, FastAPI, Django, Go, PostgreSQL, MySQL, Redis, and their ecosystems. Hosted on AWS, GCP, Azure, DigitalOcean, Vercel, Railway, or Render. If your stack includes something unusual, we'll tell you honestly during the audit whether we can support it confidently." },
];

function FAQItem({ item }: { item: typeof FAQS[number] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`pl-faq-item ${open ? 'pl-faq-item-open' : ''}`}>
      <button className="pl-faq-q" onClick={() => setOpen(!open)} aria-expanded={open}>
        {item.q}
        <span className={`pl-faq-icon ${open ? 'pl-faq-icon-open' : ''}`} aria-hidden="true">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="pl-faq-a">{item.a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Comparison table data ────────────────────────────────────────────────────
type Row = { cat?: true; feature?: string; values?: (boolean | string)[] };
const TABLE_ROWS: Row[] = [
  { cat: true, feature: 'Monitoring' },
  { feature: 'Uptime checks (30s, 5 global locations)', values: [true, true, true] },
  { feature: 'Error rate & exception tracking', values: [true, true, true] },
  { feature: 'Performance & response time monitoring', values: [false, true, true] },
  { feature: 'Database query performance monitoring', values: [false, true, true] },
  { feature: 'Security event detection', values: [false, true, true] },
  { feature: 'Custom alert thresholds', values: [false, true, true] },
  { feature: 'Anomaly detection (auto)', values: [false, false, true] },

  { cat: true, feature: 'Security' },
  { feature: 'Monthly security scan', values: [true, true, true] },
  { feature: 'Monthly dependency audit & patches', values: [true, true, true] },
  { feature: 'Weekly security scan', values: [false, true, true] },
  { feature: 'Immediate critical CVE patches', values: [false, true, true] },
  { feature: 'Quarterly full security audit', values: [false, false, true] },

  { cat: true, feature: 'Bug Fixes' },
  { feature: 'Bug fixes per month', values: ['Up to 5', 'Unlimited', 'Unlimited'] },
  { feature: 'Bug response SLA', values: ['<8 hrs (business hrs)', '<4 hrs (business hrs)', '<1 hr (24/7)'] },

  { cat: true, feature: 'Features & Performance' },
  { feature: 'Feature hours per month', values: ['None', '4 hours', '10 hours'] },
  { feature: 'Monthly performance optimization', values: [false, true, true] },
  { feature: 'Load testing', values: [false, false, true] },
  { feature: 'Continuous optimization', values: [false, false, true] },

  { cat: true, feature: 'Communication' },
  { feature: 'Monthly written report', values: [true, true, true] },
  { feature: 'Dedicated Slack channel', values: [false, true, true] },
  { feature: 'Monthly video call', values: [false, true, true] },
  { feature: 'Weekly check-in', values: [false, false, true] },
  { feature: 'Quarterly business review', values: [false, false, true] },

  { cat: true, feature: 'AI Agents' },
  { feature: 'Basic agent monitoring', values: [false, true, true] },
  { feature: 'Drift detection & retraining alerts', values: [false, false, true] },
  { feature: 'Full agent oversight', values: [false, false, true] },

  { cat: true, feature: 'SLA & Backup' },
  { feature: 'Uptime SLA', values: ['99.5%', '99.9%', '99.95%'] },
  { feature: 'Response time guarantee in writing', values: [true, true, true] },
  { feature: 'Daily backups', values: [true, true, true] },
  { feature: 'Hourly backups', values: [false, false, true] },
  { feature: 'Disaster recovery plan', values: [false, false, true] },
  { feature: 'Dedicated maintenance engineer', values: [false, false, true] },
];

function CheckIcon({ ok, featured }: { ok: boolean; featured?: boolean }) {
  if (ok) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={A} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="pl-table-check" aria-label="Included">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pl-table-x" aria-label="Not included">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

function renderCell(val: boolean | string, featured?: boolean) {
  if (typeof val === 'boolean') return <CheckIcon ok={val} featured={featured} />;
  return <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>{val}</span>;
}

// ── Main component ────────────────────────────────────────────────────────────
export default function PlansPage() {
  return (
    <>
      <style>{STYLES}</style>

      {/* ── Hero ── */}
      <section className="pl-hero">
        <div className="pl-orb-a" aria-hidden="true" />
        <div className="pl-orb-b" aria-hidden="true" />
        <div className="pl-wrap" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <div className="pl-mono-label">PLANS &amp; PRICING</div>
          </motion.div>
          <motion.h1
            className="pl-h1"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            Pick the{' '}
            <span className="pl-grad">Coverage That Fits.</span>{' '}
            Upgrade Anytime.
          </motion.h1>
          <motion.p
            className="pl-hero-sub"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16 }}
          >
            Real numbers. No hidden fees. No long-term contracts.
            Three plans built for different stages — same quality of care at every tier.
          </motion.p>
          <motion.div
            className="pl-btn-row"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22 }}
          >
            <Link href="#plans" className="pl-btn-primary">
              See All Plans
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link href="/services/how-it-works" className="pl-btn-ghost">
              How It Works
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="pl-ceo-quote">
              <p>&ldquo;We priced these plans so a solo founder can afford real protection from day one.
                If the price ever feels like it doesn&apos;t fit your stage, talk to us — we&apos;d rather
                find a way than lose you to a gap in the market.&rdquo;</p>
              <span className="pl-ceo-by">— Arifur Rahman, CEO, SocioFi Technology</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Three Plans ── */}
      <section className="pl-plans-sec" id="plans">
        <div className="pl-wrap">
          <motion.div
            className="pl-plans-header"
            variants={fadeUp} initial="hidden" whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            <div className="pl-sec-label" style={{ justifyContent: 'center' }}>THREE PLANS</div>
            <h2 className="pl-h2">The right plan for your stage.</h2>
            <p className="sec-body-sub">
              Not sure which to pick? Use the recommender below or{' '}
              <Link href="/services/get-protected" style={{ color: A, textDecoration: 'none' }}>talk to us first</Link>.
            </p>
          </motion.div>

          <div className="pl-plans-grid">
            {/* Essential */}
            <motion.div
              className="pl-plan-card"
              variants={fadeUp} initial="hidden" whileInView="visible" custom={0}
              viewport={{ once: true, amount: 0.1 }}
            >
              <p className="pl-plan-name">Essential</p>
              <p className="pl-plan-tagline">For small apps, MVPs, and early-stage products.</p>
              <p className="pl-plan-audience">Best for: under 1,000 customers</p>
              <div className="pl-plan-price">
                <span className="pl-plan-amount">$499</span>
                <span className="pl-plan-period">/month</span>
              </div>
              <p className="pl-plan-note">Billed monthly. Cancel any time.</p>
              <div className="pl-plan-sla">
                <span className="pl-sla-item">&lt;8 hr response</span>
                <span className="pl-sla-item">99.5% uptime SLA</span>
              </div>
              <ul className="pl-plan-features">
                {[
                  'Uptime + error monitoring (30s, 5 global locations)',
                  'Up to 5 bug fixes per month',
                  'Monthly security scan + patch',
                  'Daily backups',
                  'Monthly written report',
                  '<8 hr bug response (business hours)',
                ].map((f) => (
                  <li key={f}>
                    <span className="pl-check">
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={A} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="pl-plan-not">
                <p className="pl-plan-not-title">Not included</p>
                <ul className="pl-plan-not-list">
                  {['Feature additions', '24/7 response', 'Agent monitoring', 'Dedicated Slack'].map((n) => (
                    <li key={n}>
                      <svg className="pl-x-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/services/get-protected?plan=essential" className="pl-plan-cta pl-cta-default">
                Choose Essential
              </Link>
            </motion.div>

            {/* Growth */}
            <motion.div
              className="pl-plan-card pl-plan-featured"
              variants={fadeUp} initial="hidden" whileInView="visible" custom={0.08}
              viewport={{ once: true, amount: 0.1 }}
            >
              <div className="pl-popular-badge">MOST POPULAR</div>
              <p className="pl-plan-name" style={{ color: A }}>Growth</p>
              <p className="pl-plan-tagline">For growing products and business-critical tools.</p>
              <p className="pl-plan-audience">Best for: 1,000 – 50,000 customers</p>
              <div className="pl-plan-price">
                <span className="pl-plan-amount" style={{ color: A }}>$999</span>
                <span className="pl-plan-period">/month</span>
              </div>
              <p className="pl-plan-note">Most clients stay on Growth for 12+ months.</p>
              <div className="pl-plan-sla">
                <span className="pl-sla-item">&lt;4 hr response</span>
                <span className="pl-sla-item">99.9% uptime SLA</span>
              </div>
              <ul className="pl-plan-features">
                {[
                  'Everything in Essential',
                  'Advanced monitoring (performance + security + database)',
                  'Unlimited bug fixes',
                  'Weekly security scan + immediate critical patches',
                  '4 feature hours per month',
                  'Monthly performance optimization',
                  'Dedicated Slack channel',
                  'Monthly video call with your engineer',
                  'Basic agent monitoring',
                ].map((f) => (
                  <li key={f}>
                    <span className={`pl-check pl-check-featured`}>
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={A} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/services/get-protected?plan=growth" className="pl-plan-cta pl-cta-featured" style={{ marginTop: 'auto' }}>
                Choose Growth
              </Link>
            </motion.div>

            {/* Scale */}
            <motion.div
              className="pl-plan-card"
              variants={fadeUp} initial="hidden" whileInView="visible" custom={0.16}
              viewport={{ once: true, amount: 0.1 }}
            >
              <p className="pl-plan-name">Scale</p>
              <p className="pl-plan-tagline">For mission-critical, revenue-generating systems.</p>
              <p className="pl-plan-audience">Best for: 50,000+ customers or 24/7 needs</p>
              <div className="pl-plan-price">
                <span className="pl-plan-amount">$1,999</span>
                <span className="pl-plan-period">/month</span>
              </div>
              <p className="pl-plan-note">Includes a dedicated maintenance engineer.</p>
              <div className="pl-plan-sla">
                <span className="pl-sla-item">&lt;1 hr response 24/7</span>
                <span className="pl-sla-item">99.95% uptime SLA</span>
              </div>
              <ul className="pl-plan-features">
                {[
                  'Everything in Growth',
                  'Complete monitoring + custom alerts + anomaly detection',
                  '24/7 response — including weekends and holidays',
                  '10 feature hours per month',
                  'Continuous optimization + load testing',
                  'Hourly backups + disaster recovery plan',
                  'Full agent monitoring (drift + retraining alerts)',
                  'Weekly check-in + quarterly business review',
                  'Dedicated maintenance engineer',
                ].map((f) => (
                  <li key={f}>
                    <span className="pl-check">
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={A} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/services/get-protected?plan=scale" className="pl-plan-cta pl-cta-default">
                Choose Scale
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Plan Recommender ── */}
      <section className="pl-rec-sec">
        <div className="pl-wrap">
          <motion.div
            className="pl-rec-header"
            variants={fadeUp} initial="hidden" whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="pl-sec-label" style={{ justifyContent: 'center' }}>NOT SURE WHICH TO PICK?</div>
            <h2 className="pl-h2">Answer 4 questions. We&apos;ll recommend a plan.</h2>
            <p className="sec-body-sub">
              Takes less than 60 seconds. No email required.
            </p>
          </motion.div>
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" custom={0.1}
            viewport={{ once: true, amount: 0.1 }}
          >
            <PlanRecommender />
          </motion.div>
        </div>
      </section>

      {/* ── Add-Ons ── */}
      <section className="pl-addons-sec">
        <div className="pl-wrap">
          <motion.div
            className="pl-addons-header"
            variants={fadeUp} initial="hidden" whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="pl-sec-label" style={{ justifyContent: 'center' }}>ADD-ONS</div>
            <h2 className="pl-h2">Need more? Layer it on.</h2>
            <p className="sec-body-sub">Add-ons can be applied to any active plan. Cancel add-ons independently of your plan.</p>
          </motion.div>
          <div className="pl-addons-grid">
            {[
              { price: '$120', freq: 'per hour', title: 'Extra Feature Hours', desc: 'Need more than your plan includes this month? Buy hours as needed. Same engineers, same codebase context. No retainer required.' },
              { price: '$299', freq: 'per month', title: '24/7 Escalation Coverage', desc: 'Upgrade Essential or Growth to 24/7 critical incident response. Ideal for products that go global before you need to upgrade your plan.' },
              { price: '$199', freq: 'per agent / month', title: 'Agent Monitoring Pack', desc: 'For products with custom AI agents not built by SocioFi. Drift monitoring, output validation, cost tracking, and performance baselines.' },
              { price: '$499', freq: 'per quarter', title: 'Security Audit', desc: 'Deep-dive security review beyond automated scans. Manual pen testing of authentication, authorization, and data flows. Written report included.' },
              { price: '$299', freq: 'per test', title: 'Performance & Load Test', desc: 'Simulate real traffic load against your production or staging environment. Identify bottlenecks before they affect real customers.' },
              { price: '$399', freq: 'one-time', title: 'Database Optimization', desc: 'Query profiling, index analysis, schema review, and optimization recommendations. Includes before/after performance benchmarks.' },
            ].map((addon, i) => (
              <motion.div
                key={addon.title}
                className="pl-addon-card"
                variants={fadeUp} initial="hidden" whileInView="visible" custom={i * 0.07}
                viewport={{ once: true, amount: 0.15 }}
              >
                <p className="pl-addon-price">{addon.price}</p>
                <p className="pl-addon-freq">{addon.freq}</p>
                <h3 className="pl-addon-title">{addon.title}</h3>
                <p className="pl-addon-desc">{addon.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison Table ── */}
      <section className="pl-table-sec">
        <div className="pl-wrap">
          <motion.div
            className="pl-table-header"
            variants={fadeUp} initial="hidden" whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="pl-sec-label" style={{ justifyContent: 'center' }}>FULL COMPARISON</div>
            <h2 className="pl-h2">Everything, side by side.</h2>
          </motion.div>
          <motion.div
            className="pl-table-wrap"
            variants={fadeUp} initial="hidden" whileInView="visible" custom={0.1}
            viewport={{ once: true, amount: 0.1 }}
          >
            <table className="pl-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Essential</th>
                  <th style={{ color: A }}>Growth</th>
                  <th>Scale</th>
                </tr>
              </thead>
              <tbody>
                {TABLE_ROWS.map((row, i) => {
                  if (row.cat) {
                    return (
                      <tr key={`cat-${i}`} className="pl-table-cat">
                        <td colSpan={4}>{row.feature}</td>
                      </tr>
                    );
                  }
                  return (
                    <tr key={row.feature}>
                      <td>{row.feature}</td>
                      <td>{renderCell(row.values![0])}</td>
                      <td className="pl-table-highlight">{renderCell(row.values![1], true)}</td>
                      <td>{renderCell(row.values![2])}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* ── Cost Comparison ── */}
      <section className="pl-compare-sec">
        <div className="pl-wrap">
          <motion.div
            className="pl-compare-header"
            variants={fadeUp} initial="hidden" whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="pl-sec-label" style={{ justifyContent: 'center' }}>THE REAL COST</div>
            <h2 className="pl-h2">Compare your options honestly.</h2>
            <p className="sec-body-sub">
              What does it actually cost to keep software maintained? Here&apos;s how the options stack up.
            </p>
          </motion.div>
          <motion.div
            className="pl-compare-table-wrap"
            variants={fadeUp} initial="hidden" whileInView="visible" custom={0.1}
            viewport={{ once: true, amount: 0.1 }}
          >
            <table className="pl-compare-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Do Nothing</th>
                  <th>Freelancer</th>
                  <th>Full-time Hire</th>
                  <th style={{ color: A }}>SocioFi Services</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Monthly cost</td>
                  <td>$0</td>
                  <td>$1,000 – $3,000</td>
                  <td>$5,000 – $10,000</td>
                  <td className="pl-compare-highlight">$499 – $1,999</td>
                </tr>
                <tr>
                  <td>Response time</td>
                  <td>When you notice</td>
                  <td>When available</td>
                  <td>Depends on them</td>
                  <td className="pl-compare-highlight">&lt;1 – 8 hrs (written SLA)</td>
                </tr>
                <tr>
                  <td>Security monitoring</td>
                  <td>None</td>
                  <td>Inconsistent</td>
                  <td>Their expertise</td>
                  <td className="pl-compare-highlight">Automated + human review</td>
                </tr>
                <tr>
                  <td>Uptime monitoring</td>
                  <td>None</td>
                  <td>Maybe</td>
                  <td>If they set it up</td>
                  <td className="pl-compare-highlight">24/7, 5 global locations</td>
                </tr>
                <tr>
                  <td>Scales with product</td>
                  <td>No</td>
                  <td>Limited</td>
                  <td>Hire more people</td>
                  <td className="pl-compare-highlight">Yes — upgrade as you grow</td>
                </tr>
                <tr>
                  <td>Documentation</td>
                  <td>None</td>
                  <td>Unlikely</td>
                  <td>If they prioritize it</td>
                  <td className="pl-compare-highlight">Created and maintained</td>
                </tr>
                <tr>
                  <td>Commitment required</td>
                  <td>N/A</td>
                  <td>Project-by-project</td>
                  <td>Employment contract</td>
                  <td className="pl-compare-highlight">Month-to-month, cancel any time</td>
                </tr>
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="pl-faq-sec">
        <div className="pl-wrap">
          <motion.div
            className="pl-faq-header"
            variants={fadeUp} initial="hidden" whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="pl-sec-label" style={{ justifyContent: 'center' }}>FAQ</div>
            <h2 className="pl-h2">Questions we get asked a lot.</h2>
          </motion.div>
          <motion.div
            className="pl-faq-list"
            variants={fadeUp} initial="hidden" whileInView="visible" custom={0.1}
            viewport={{ once: true, amount: 0.05 }}
          >
            {FAQS.map((item) => (
              <FAQItem key={item.q} item={item} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="pl-cta-sec">
        <div className="pl-cta-orb" aria-hidden="true" />
        <div className="pl-wrap pl-cta-inner">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="pl-mono-label">GET PROTECTED</div>
            <h2 className="pl-cta-h2">Your software is running right now.<br />Is anyone watching?</h2>
            <p className="pl-cta-sub">
              Pick a plan and have monitoring active within 5 business days.
              Or start with a codebase audit if you want to know what you&apos;re working with first.
            </p>
            <div className="pl-btn-row">
              <Link href="/services/get-protected" className="pl-btn-primary">
                Get Protected
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link href="/services/audit" className="pl-btn-ghost">
                Start with an audit
              </Link>
            </div>
            <p className="pl-cta-note">Month-to-month. No contracts. First month refundable if we can&apos;t deliver.</p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
