'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

// ── Design tokens ─────────────────────────────────────────────────────────────
const A = '#E8B84D';
const F = {
  h: "var(--font-manrope,'Manrope'),sans-serif",
  b: "var(--font-dm-sans,'DM Sans'),sans-serif",
  m: "var(--font-jb-mono,'JetBrains Mono'),monospace",
};

// ── Styles ────────────────────────────────────────────────────────────────────
const STYLES = `
  .cert-page { background: var(--bg); min-height: 100vh; }

  @keyframes scarl-shimmer {
    0% { transform: translateX(-100%) skewX(-15deg); }
    100% { transform: translateX(350%) skewX(-15deg); }
  }
  @keyframes scarl-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(232,184,77,0); }
    50% { box-shadow: 0 0 0 12px rgba(232,184,77,0.08); }
  }
  @keyframes float-badge {
    0%, 100% { transform: translateY(0px) rotate(-2deg); }
    50% { transform: translateY(-8px) rotate(-2deg); }
  }

  /* Hero */
  .cert-hero {
    padding: 120px 32px 80px;
    max-width: 1100px; margin: 0 auto;
    display: grid; grid-template-columns: 1fr 380px; gap: 60px;
    align-items: center;
    position: relative;
  }
  .cert-hero-bg-orb {
    position: fixed; width: 700px; height: 700px; border-radius: 50%;
    filter: blur(140px); background: rgba(232,184,77,0.04);
    top: -200px; right: -200px; pointer-events: none; z-index: 0;
  }
  .cert-hero-label {
    font-family: ${F.m}; font-size: 0.7rem; font-weight: 500;
    color: ${A}; letter-spacing: 0.14em; text-transform: uppercase;
    display: inline-flex; align-items: center; gap: 10px; margin-bottom: 20px;
  }
  .cert-hero-label::before, .cert-hero-label::after {
    content: ''; width: 20px; height: 1.5px; background: ${A}; display: inline-block;
  }
  .cert-hero-title {
    font-family: ${F.h}; font-size: clamp(2.2rem, 4vw, 3rem); font-weight: 800;
    color: var(--text-primary); letter-spacing: -0.03em; line-height: 1.08; margin-bottom: 20px;
  }
  .cert-hero-sub {
    font-family: ${F.b}; font-size: 1rem; color: var(--text-secondary);
    line-height: 1.75; margin-bottom: 32px; max-width: 540px;
  }
  .cert-price-row { display: flex; align-items: baseline; gap: 12px; margin-bottom: 8px; }
  .cert-price { font-family: ${F.h}; font-size: 2.8rem; font-weight: 800; color: ${A}; }
  .cert-price-orig { font-family: ${F.b}; font-size: 0.9rem; color: var(--text-muted); text-decoration: line-through; }
  .cert-price-badge { background: rgba(232,184,77,0.12); border: 1px solid rgba(232,184,77,0.3); border-radius: 100px; padding: 2px 10px; font-family: ${F.m}; font-size: 0.62rem; color: ${A}; letter-spacing: 0.06em; }
  .cert-countdown { font-family: ${F.b}; font-size: 0.86rem; color: var(--text-muted); margin-bottom: 28px; }
  .cert-countdown strong { color: ${A}; }
  .cert-enroll-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 16px 36px; border-radius: 12px;
    background: linear-gradient(135deg, #D4A030, #E8B84D);
    color: #1a1a1a; font-family: ${F.h}; font-size: 0.95rem; font-weight: 700;
    text-decoration: none; transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 20px rgba(232,184,77,0.3);
  }
  .cert-enroll-btn:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(232,184,77,0.45); }

  /* CTO quote */
  .cert-quote {
    margin-top: 32px; padding: 20px 24px;
    background: var(--glass-bg); border: 1px solid var(--glass-border);
    border-radius: 12px; backdrop-filter: blur(12px);
    position: relative;
  }
  .cert-quote::before { content: '"'; position: absolute; top: 8px; left: 16px; font-family: ${F.h}; font-size: 3rem; color: rgba(232,184,77,0.2); line-height: 1; }
  .cert-quote-text { font-family: ${F.b}; font-size: 0.88rem; color: var(--text-secondary); line-height: 1.7; padding-left: 12px; }
  .cert-quote-author { margin-top: 10px; font-family: ${F.m}; font-size: 0.62rem; color: ${A}; letter-spacing: 0.06em; padding-left: 12px; }

  /* SCARL badge */
  .cert-badge-wrap {
    display: flex; align-items: center; justify-content: center;
    position: relative;
  }
  .scarl-badge {
    width: 200px; height: 200px; position: relative;
    animation: float-badge 5s ease-in-out infinite;
  }
  .scarl-badge-svg { width: 100%; height: 100%; filter: drop-shadow(0 8px 32px rgba(232,184,77,0.25)); }
  .scarl-shimmer-line {
    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    border-radius: 50%; overflow: hidden; pointer-events: none;
  }
  .scarl-shimmer-line::after {
    content: '';
    position: absolute; top: -100%; left: -100%; width: 60%; height: 300%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
    animation: scarl-shimmer 3s ease-in-out infinite;
  }
  .cert-badge-ring {
    position: absolute; width: 240px; height: 240px; border-radius: 50%;
    border: 1.5px solid rgba(232,184,77,0.12);
    animation: scarl-pulse 3s ease-in-out infinite;
  }
  .cert-badge-ring2 {
    position: absolute; width: 280px; height: 280px; border-radius: 50%;
    border: 1px solid rgba(232,184,77,0.06);
  }

  /* Section commons */
  .cert-section { padding: 80px 32px; max-width: 1000px; margin: 0 auto; }
  .cert-section-label { font-family: ${F.m}; font-size: 0.65rem; color: ${A}; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 10px; display: flex; align-items: center; gap: 8px; }
  .cert-section-label::before { content: ''; width: 16px; height: 1.5px; background: ${A}; display: inline-block; }
  .cert-section-title { font-family: ${F.h}; font-size: 1.5rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em; margin-bottom: 28px; }
  .cert-divider { height: 1px; background: var(--border); margin: 0 32px; }

  /* What SCARL means */
  .cert-outcomes-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
  .cert-outcome-item {
    display: flex; align-items: flex-start; gap: 12px;
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 10px; padding: 16px; transition: border-color 0.3s;
  }
  .cert-outcome-item:hover { border-color: rgba(232,184,77,0.25); }
  .cert-outcome-check { width: 22px; height: 22px; border-radius: 50%; background: rgba(232,184,77,0.12); border: 1.5px solid rgba(232,184,77,0.4); display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
  .cert-outcome-text { font-family: ${F.b}; font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6; }

  /* 6-week roadmap */
  .cert-roadmap {
    display: grid; grid-template-columns: repeat(6, 1fr); gap: 0;
    position: relative;
  }
  .cert-roadmap::before {
    content: ''; position: absolute; top: 28px; left: 28px; right: 28px;
    height: 2px; background: linear-gradient(90deg, #E8B84D, rgba(232,184,77,0.2));
    z-index: 0;
  }
  .cert-week {
    display: flex; flex-direction: column; align-items: center;
    text-align: center; padding: 0 8px; position: relative; z-index: 1;
  }
  .cert-week-node {
    width: 56px; height: 56px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-family: ${F.h}; font-size: 1.1rem; font-weight: 800;
    margin-bottom: 16px; flex-shrink: 0; transition: all 0.3s;
  }
  .cert-week-node.active {
    background: linear-gradient(135deg, #D4A030, #E8B84D);
    color: #1a1a1a;
    box-shadow: 0 4px 16px rgba(232,184,77,0.35);
  }
  .cert-week-node.dim {
    background: var(--bg-card); color: var(--text-muted);
    border: 2px solid var(--border);
  }
  .cert-week-module { font-family: ${F.h}; font-size: 0.8rem; font-weight: 700; color: var(--text-primary); margin-bottom: 8px; }
  .cert-week-module.dim { color: var(--text-muted); }
  .cert-week-topics { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 4px; }
  .cert-week-topics li { font-family: ${F.b}; font-size: 0.72rem; color: var(--text-muted); line-height: 1.4; }
  .cert-week-topics li.dim { opacity: 0.5; }
  .cert-week-live { font-family: ${F.m}; font-size: 0.55rem; color: ${A}; letter-spacing: 0.06em; margin-top: 8px; padding: 2px 8px; border: 1px solid rgba(232,184,77,0.3); border-radius: 100px; }
  .cert-week-live.dim { opacity: 0.4; }

  /* Roadmap mobile */
  .cert-roadmap-mobile { display: none; flex-direction: column; gap: 0; }
  .cert-week-mobile { display: flex; gap: 16px; padding-bottom: 24px; position: relative; }
  .cert-week-mobile:last-child { padding-bottom: 0; }
  .cert-wmob-left { display: flex; flex-direction: column; align-items: center; }
  .cert-wmob-node { width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: ${F.h}; font-size: 1rem; font-weight: 800; flex-shrink: 0; }
  .cert-wmob-node.active { background: linear-gradient(135deg, #D4A030, #E8B84D); color: #1a1a1a; box-shadow: 0 4px 12px rgba(232,184,77,0.3); }
  .cert-wmob-node.dim { background: var(--bg-card); color: var(--text-muted); border: 2px solid var(--border); }
  .cert-wmob-line { width: 2px; flex: 1; background: rgba(232,184,77,0.2); margin-top: 4px; }
  .cert-week-mobile:last-child .cert-wmob-line { display: none; }
  .cert-wmob-content { flex: 1; padding-top: 8px; }
  .cert-wmob-module { font-family: ${F.h}; font-size: 0.9rem; font-weight: 700; color: var(--text-primary); margin-bottom: 4px; }
  .cert-wmob-module.dim { color: var(--text-muted); }

  /* Program details */
  .cert-details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
  .cert-detail-box { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 28px; }
  .cert-detail-box-title { font-family: ${F.h}; font-size: 1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 20px; padding-bottom: 14px; border-bottom: 1px solid var(--border); }
  .cert-include-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; }
  .cert-include-item { display: flex; align-items: flex-start; gap: 10px; font-family: ${F.b}; font-size: 0.86rem; color: var(--text-secondary); line-height: 1.55; }
  .cert-include-dot { width: 18px; height: 18px; border-radius: 50%; background: rgba(232,184,77,0.1); border: 1.5px solid rgba(232,184,77,0.35); display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; }
  .cert-spec-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--border); }
  .cert-spec-row:last-child { border-bottom: none; }
  .cert-spec-label { font-family: ${F.b}; font-size: 0.82rem; color: var(--text-muted); }
  .cert-spec-value { font-family: ${F.h}; font-size: 0.84rem; font-weight: 600; color: var(--text-primary); }

  /* Pricing card */
  .cert-pricing-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px; padding: 36px; max-width: 700px; margin: 0 auto; position: relative; overflow: hidden; }
  .cert-pricing-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #D4A030, #E8B84D, #D4A030); }
  .cert-pricing-tiers { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 24px; }
  .cert-pricing-tier { text-align: center; padding: 20px 16px; border-radius: 12px; border: 1.5px solid var(--border); transition: all 0.3s; }
  .cert-pricing-tier.featured { border-color: rgba(232,184,77,0.5); background: rgba(232,184,77,0.05); }
  .cert-tier-label { font-family: ${F.m}; font-size: 0.6rem; color: var(--text-muted); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px; }
  .cert-tier-label.amber { color: ${A}; }
  .cert-tier-price { font-family: ${F.h}; font-size: 1.6rem; font-weight: 800; color: var(--text-primary); margin-bottom: 4px; }
  .cert-tier-price.amber { color: ${A}; }
  .cert-tier-desc { font-family: ${F.b}; font-size: 0.76rem; color: var(--text-muted); line-height: 1.5; }
  .cert-pricing-guarantee { display: flex; align-items: center; gap: 10px; background: rgba(232,184,77,0.06); border: 1px solid rgba(232,184,77,0.2); border-radius: 8px; padding: 12px 16px; margin-bottom: 24px; }
  .cert-guarantee-text { font-family: ${F.b}; font-size: 0.82rem; color: var(--text-secondary); }

  /* Persona cards */
  .cert-personas { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
  .cert-persona { background: var(--bg-card); border: 1px solid var(--border); border-radius: 14px; padding: 24px; transition: all 0.3s; }
  .cert-persona:hover { border-color: rgba(232,184,77,0.25); transform: translateY(-2px); }
  .cert-persona-icon { width: 40px; height: 40px; border-radius: 10px; background: rgba(232,184,77,0.1); display: flex; align-items: center; justify-content: center; margin-bottom: 14px; }
  .cert-persona-title { font-family: ${F.h}; font-size: 0.92rem; font-weight: 700; color: var(--text-primary); margin-bottom: 8px; }
  .cert-persona-desc { font-family: ${F.b}; font-size: 0.82rem; color: var(--text-secondary); line-height: 1.6; }

  /* Testimonials */
  .cert-testimonials { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .cert-testimonial { background: var(--bg-card); border: 1px solid var(--border); border-radius: 14px; padding: 28px; position: relative; }
  .cert-testimonial::before { content: '"'; position: absolute; top: 12px; left: 20px; font-family: ${F.h}; font-size: 3.5rem; color: rgba(232,184,77,0.15); line-height: 1; }
  .cert-testimonial-text { font-family: ${F.b}; font-size: 0.9rem; color: var(--text-secondary); line-height: 1.75; padding-top: 12px; }
  .cert-testimonial-author { margin-top: 16px; display: flex; align-items: center; gap: 10px; }
  .cert-testimonial-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #D4A030, #E8B84D); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .cert-testimonial-name { font-family: ${F.h}; font-size: 0.82rem; font-weight: 700; color: var(--text-primary); }
  .cert-testimonial-role { font-family: ${F.b}; font-size: 0.72rem; color: var(--text-muted); }

  /* FAQ */
  .cert-faq { display: flex; flex-direction: column; gap: 0; }
  .cert-faq-item { border-bottom: 1px solid var(--border); }
  .cert-faq-q {
    width: 100%; text-align: left; background: none; border: none; cursor: pointer;
    padding: 18px 0; display: flex; align-items: center; justify-content: space-between;
    gap: 16px; font-family: ${F.h}; font-size: 0.92rem; font-weight: 700; color: var(--text-primary);
    transition: color 0.2s;
  }
  .cert-faq-q:hover { color: ${A}; }
  .cert-faq-a { font-family: ${F.b}; font-size: 0.88rem; color: var(--text-secondary); line-height: 1.7; padding-bottom: 18px; }

  /* Bottom CTA */
  .cert-cta { background: var(--bg-2); border-top: 1px solid var(--border); padding: 100px 32px; text-align: center; }
  .cert-cta-inner { max-width: 600px; margin: 0 auto; }
  .cert-cta-title { font-family: ${F.h}; font-size: 1.8rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.025em; margin-bottom: 14px; }
  .cert-cta-sub { font-family: ${F.b}; font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 32px; line-height: 1.6; }
  .cert-cta-row { display: flex; align-items: center; justify-content: center; gap: 14px; flex-wrap: wrap; margin-bottom: 16px; }
  .cert-cta-ghost {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 14px 28px; border-radius: 10px;
    border: 1.5px solid var(--border); color: var(--text-secondary);
    font-family: ${F.b}; font-size: 0.88rem;
    text-decoration: none; transition: all 0.2s;
  }
  .cert-cta-ghost:hover { border-color: rgba(232,184,77,0.4); color: ${A}; }
  .cert-cta-note { font-family: ${F.b}; font-size: 0.82rem; color: var(--text-muted); }
  .cert-cta-note strong { color: ${A}; }

  @media (max-width: 1000px) {
    .cert-roadmap { display: none; }
    .cert-roadmap-mobile { display: flex; }
  }
  @media (max-width: 900px) {
    .cert-hero { grid-template-columns: 1fr; gap: 48px; }
    .cert-badge-wrap { order: -1; }
    .cert-details-grid { grid-template-columns: 1fr; }
    .cert-personas { grid-template-columns: 1fr 1fr; }
    .cert-testimonials { grid-template-columns: 1fr; }
  }
  @media (max-width: 640px) {
    .cert-section { padding: 60px 20px; }
    .cert-divider { margin: 0 20px; }
    .cert-hero { padding: 100px 20px 60px; }
    .cert-outcomes-grid { grid-template-columns: 1fr; }
    .cert-pricing-tiers { grid-template-columns: 1fr; }
    .cert-personas { grid-template-columns: 1fr; }
    .cert-cta { padding: 70px 20px; }
  }
`;

const WEEKS = [
  { num: 1, module: 'Foundations', topics: ['How software gets built in 2026', 'AI coding tools explained', 'The hybrid human-AI model', 'What clients actually need to know'], active: true },
  { num: 2, module: 'Architecture', topics: ['Reading technical proposals', 'Databases, APIs, hosting', 'When to build vs buy', 'Evaluating vendor claims'], active: true },
  { num: 3, module: 'AI Development', topics: ['How AI coding works', 'Quality gates and review', 'Limitations and failure modes', 'What AI can\'t do yet'], active: true },
  { num: 4, module: 'AI Agents', topics: ['What agents actually are', 'Deployment and oversight', 'AaaS model explained', 'When to use agents'], active: false },
  { num: 5, module: 'Management', topics: ['Leading AI-powered projects', 'Setting expectations', 'Evaluating output quality', 'Running development teams'], active: false },
  { num: 6, module: 'Strategy', topics: ['Build/buy/agent decisions', 'Vendor evaluation', 'AI transformation roadmap', 'Your plan going forward'], active: false },
];

const OUTCOMES = [
  'Evaluate technical proposals with confidence',
  'Lead AI-powered development projects effectively',
  'Make informed build/buy/agent decisions',
  'Manage development teams and vendor relationships',
  'Understand AI agents and when to deploy them',
  'Communicate fluently with engineers without being one',
];

const INCLUDES = [
  '6 self-paced modules (24 hours of content)',
  '6 weekly live group sessions (1 hour each)',
  'Course materials and reference guides',
  'Final practical assessment',
  'Digital SCARL badge (LinkedIn-compatible)',
  'Alumni community access',
  '1 free consultation with SocioFi Studio ($500 value)',
];

const SPECS = [
  { label: 'Duration', value: '6 weeks, ~4 hours/week' },
  { label: 'Format', value: 'Self-paced + weekly live Zoom' },
  { label: 'Cohort size', value: '20–30 people' },
  { label: 'Prerequisites', value: 'None' },
  { label: 'Assessment', value: 'Practical (evaluate a proposal + write a brief)' },
  { label: 'Certificate', value: 'Digital shareable badge' },
];

const PERSONAS = [
  { icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={A} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ), title: 'Founders', desc: 'You\'re building a software product and want to stop feeling lost in technical conversations with your developers and vendors.' },
  { icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={A} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  ), title: 'Business leaders', desc: 'You\'re responsible for technology decisions at your company and need the literacy to make them with confidence, not just deference.' },
  { icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={A} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ), title: 'Managers', desc: 'You manage teams or projects that involve AI development and need to hold engineers accountable and set realistic expectations.' },
];

const TESTIMONIALS = [
  { text: "I\'ve been working with development teams for years and always felt like I was being managed rather than informed. After SCARL, that changed completely. I can read a proposal, ask the right questions, and push back when something doesn't make sense. It\'s the most practical professional development I\'ve done.", name: 'Sarah Chen', role: 'COO, Series A fintech startup' },
  { text: "The assessment at the end was genuinely challenging — I had to evaluate a real proposal and write a project brief under time pressure. It felt like something that actually tested what I\'d learned, not just whether I\'d done the work. That credibility is exactly what I needed for my investors.", name: 'Marcus Adeyemi', role: 'Founder, logistics SaaS' },
];

const FAQS = [
  { q: 'What is SCARL and how is it assessed?', a: 'SCARL (SocioFi Certified AI-Ready Leader) is a 6-week programme ending in a practical assessment: you evaluate a real technical proposal and write a project brief. There are no multiple-choice questions. You pass by demonstrating that you can actually do the work.' },
  { q: 'How is the assessment structured?', a: 'The final assessment consists of two parts: a written evaluation of a provided technical proposal (identifying risks, gaps, and questions you would ask), and a project brief for a provided business scenario. Both are graded by SocioFi engineers against a clear rubric.' },
  { q: 'Can I do this while working full-time?', a: 'Yes — the programme is designed for that. Expect roughly 4 hours per week: about 3 hours of self-paced content plus a 1-hour live group session. The live sessions are recorded if you miss one.' },
  { q: 'Is there a corporate group rate?', a: 'Yes — teams of 5 or more get $349 per person. Private cohorts are available for teams of 10 or more at custom pricing. See our corporate programme for details.' },
  { q: 'What\'s the refund policy?', a: 'Full refund if requested before the end of Week 2. After Week 2, no refund — but you can defer to the next cohort if circumstances change.' },
  { q: 'Do I need a technical background?', a: 'No. The programme is explicitly designed for people without a technical background. If anything, a heavy technical background is less valuable here — SCARL teaches the business and leadership perspective, not how to code.' },
  { q: 'How is the certificate verified?', a: 'All SCARL certificates include a unique verification link. Employers, investors, or partners can visit the link to confirm your certification, the date awarded, and the cohort number. The certificate is also available in a LinkedIn-compatible format.' },
  { q: 'When is the next cohort?', a: 'The next cohort starts May 1, 2026. There are 14 seats remaining. Cohorts run three times per year (January, May, September). You can also join the waitlist for a future cohort if the current one is full.' },
];

// ── Icons ─────────────────────────────────────────────────────────────────────
function IcoArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
function IcoCheck() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={A} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function IcoShield() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={A} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
function IcoDownload() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
function IcoUser() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  );
}

// ── SCARL Badge SVG ───────────────────────────────────────────────────────────
function ScarlBadge() {
  return (
    <div className="scarl-badge">
      <svg className="scarl-badge-svg" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="scarlGrad1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#D4A030" />
            <stop offset="100%" stopColor="#F0CC6A" />
          </linearGradient>
          <linearGradient id="scarlGrad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E8B84D" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#E8B84D" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        {/* Shield shape */}
        <path d="M100 12 L170 38 L170 95 C170 140 100 188 100 188 C100 188 30 140 30 95 L30 38 Z"
          fill="url(#scarlGrad2)" stroke="url(#scarlGrad1)" strokeWidth="2" />
        {/* Inner shield */}
        <path d="M100 28 L156 50 L156 93 C156 129 100 169 100 169 C100 169 44 129 44 93 L44 50 Z"
          fill="none" stroke="rgba(232,184,77,0.3)" strokeWidth="1" />
        {/* SCARL text */}
        <text x="100" y="92" textAnchor="middle" fontFamily="Manrope,sans-serif" fontWeight="800" fontSize="22" fill="url(#scarlGrad1)">SCARL</text>
        {/* Subtitle */}
        <text x="100" y="110" textAnchor="middle" fontFamily="JetBrains Mono,monospace" fontWeight="500" fontSize="6.5" fill="rgba(232,184,77,0.7)" letterSpacing="2">CERTIFIED AI-READY</text>
        <text x="100" y="121" textAnchor="middle" fontFamily="JetBrains Mono,monospace" fontWeight="500" fontSize="6.5" fill="rgba(232,184,77,0.7)" letterSpacing="2">LEADER</text>
        {/* Stars */}
        <text x="72" y="138" textAnchor="middle" fontSize="8" fill="rgba(232,184,77,0.5)">★</text>
        <text x="100" y="140" textAnchor="middle" fontSize="10" fill="rgba(232,184,77,0.7)">★</text>
        <text x="128" y="138" textAnchor="middle" fontSize="8" fill="rgba(232,184,77,0.5)">★</text>
        {/* SocioFi mark */}
        <text x="100" y="155" textAnchor="middle" fontFamily="JetBrains Mono,monospace" fontWeight="500" fontSize="5.5" fill="rgba(232,184,77,0.45)" letterSpacing="1.5">SOCIOFI TECHNOLOGY</text>
        {/* Decorative lines */}
        <line x1="60" y1="70" x2="140" y2="70" stroke="rgba(232,184,77,0.2)" strokeWidth="0.75" />
        <line x1="60" y1="162" x2="140" y2="162" stroke="rgba(232,184,77,0.2)" strokeWidth="0.75" />
      </svg>
      <div className="scarl-shimmer-line" />
    </div>
  );
}

// ── FAQ item ──────────────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="cert-faq-item">
      <button className="cert-faq-q" onClick={() => setOpen((p) => !p)}>
        {q}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s', flexShrink: 0 }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <motion.div
          className="cert-faq-a"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.28 }}
        >
          {a}
        </motion.div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function CertificationPage() {
  return (
    <>
      <style>{STYLES}</style>
      <main className="cert-page">

        {/* Hero */}
        <section style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="cert-hero-bg-orb" />
          <div className="cert-hero">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
              <div className="cert-hero-label">SCARL Certification</div>
              <h1 className="cert-hero-title">Become a Certified AI-Ready Leader.</h1>
              <p className="cert-hero-sub">
                A 6-week structured programme that gives business leaders comprehensive technical literacy in AI development, AI agents, and modern software management.
              </p>

              <div className="cert-price-row">
                <span className="cert-price">$499</span>
                <span className="cert-price-orig">$499</span>
                <span className="cert-price-badge">Early bird $399</span>
              </div>
              <p className="cert-countdown">
                Next cohort starts <strong>May 1, 2026</strong> &middot; <strong>14 seats remaining</strong>
              </p>

              <Link href="#enroll" className="cert-enroll-btn">
                Enroll in Next Cohort <IcoArrow />
              </Link>

              <div className="cert-quote">
                <p className="cert-quote-text">
                  Most non-technical leaders aren&apos;t missing intelligence — they&apos;re missing vocabulary. SCARL gives you the vocabulary, the frameworks, and the confidence to lead in a world where software is built with AI.
                </p>
                <div className="cert-quote-author">Kamrul Hasan &middot; CTO, SocioFi Technology</div>
              </div>
            </motion.div>

            <motion.div className="cert-badge-wrap" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.1 }}>
              <div className="cert-badge-ring2" />
              <div className="cert-badge-ring" />
              <ScarlBadge />
            </motion.div>
          </div>
        </section>

        <div className="cert-divider" />

        {/* What SCARL means */}
        <section className="cert-section">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
            <div className="cert-section-label">What SCARL means</div>
            <h2 className="cert-section-title">After 6 weeks, you&apos;ll be able to:</h2>
          </motion.div>
          <div className="cert-outcomes-grid">
            {OUTCOMES.map((o, i) => (
              <motion.div key={i} className="cert-outcome-item" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.06 }}>
                <div className="cert-outcome-check"><IcoCheck /></div>
                <span className="cert-outcome-text">{o}</span>
              </motion.div>
            ))}
          </div>
        </section>

        <div className="cert-divider" />

        {/* 6-week roadmap */}
        <section className="cert-section" style={{ maxWidth: 1100 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
            <div className="cert-section-label">6-week programme</div>
            <h2 className="cert-section-title">The complete roadmap</h2>
          </motion.div>

          {/* Desktop roadmap */}
          <motion.div className="cert-roadmap" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            {WEEKS.map((w) => (
              <div key={w.num} className="cert-week">
                <div className={`cert-week-node${w.active ? ' active' : ' dim'}`}>{w.num}</div>
                <div className={`cert-week-module${w.active ? '' : ' dim'}`}>{w.module}</div>
                <ul className="cert-week-topics">
                  {w.topics.map((t, i) => (
                    <li key={i} className={w.active ? '' : 'dim'}>{t}</li>
                  ))}
                </ul>
                <div className={`cert-week-live${w.active ? '' : ' dim'}`}>LIVE SESSION</div>
              </div>
            ))}
          </motion.div>

          {/* Mobile roadmap */}
          <div className="cert-roadmap-mobile">
            {WEEKS.map((w) => (
              <div key={w.num} className="cert-week-mobile">
                <div className="cert-wmob-left">
                  <div className={`cert-wmob-node${w.active ? ' active' : ' dim'}`}>{w.num}</div>
                  <div className="cert-wmob-line" />
                </div>
                <div className="cert-wmob-content">
                  <div className={`cert-wmob-module${w.active ? '' : ' dim'}`}>{w.module}</div>
                  <ul className="cert-week-topics" style={{ textAlign: 'left' }}>
                    {w.topics.map((t, i) => (
                      <li key={i} className={w.active ? '' : 'dim'}>{t}</li>
                    ))}
                  </ul>
                  <div className={`cert-week-live${w.active ? '' : ' dim'}`} style={{ marginTop: 8 }}>LIVE SESSION</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="cert-divider" />

        {/* Programme details */}
        <section className="cert-section">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
            <div className="cert-section-label">Programme details</div>
            <h2 className="cert-section-title">Everything that&apos;s included</h2>
          </motion.div>
          <div className="cert-details-grid">
            <motion.div className="cert-detail-box" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
              <div className="cert-detail-box-title">What&apos;s Included</div>
              <ul className="cert-include-list">
                {INCLUDES.map((inc, i) => (
                  <li key={i} className="cert-include-item">
                    <div className="cert-include-dot"><IcoCheck /></div>
                    {inc}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div className="cert-detail-box" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
              <div className="cert-detail-box-title">The Details</div>
              {SPECS.map((s, i) => (
                <div key={i} className="cert-spec-row">
                  <span className="cert-spec-label">{s.label}</span>
                  <span className="cert-spec-value">{s.value}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        <div className="cert-divider" />

        {/* Pricing */}
        <section className="cert-section">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
            <div className="cert-section-label">Pricing</div>
            <h2 className="cert-section-title">Simple, clear pricing</h2>
          </motion.div>
          <motion.div className="cert-pricing-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
            <div className="cert-pricing-tiers">
              <div className="cert-pricing-tier">
                <div className="cert-tier-label">Standard</div>
                <div className="cert-tier-price">$499</div>
                <div className="cert-tier-desc">Full programme, all sessions, alumni access</div>
              </div>
              <div className="cert-pricing-tier featured">
                <div className="cert-tier-label amber">Early Bird</div>
                <div className="cert-tier-price amber">$399</div>
                <div className="cert-tier-desc">Save $100 — enroll before April 15, 2026</div>
              </div>
              <div className="cert-pricing-tier">
                <div className="cert-tier-label">Corporate 5+</div>
                <div className="cert-tier-price">$349<span style={{ fontSize: '0.9rem', fontWeight: 400 }}>/person</span></div>
                <div className="cert-tier-desc">Teams of 5 or more, invoiced per company</div>
              </div>
            </div>
            <div className="cert-pricing-guarantee">
              <IcoShield />
              <span className="cert-guarantee-text">
                <strong style={{ color: 'var(--text-primary)' }}>30-day money-back guarantee</strong> after Week 2 — if you&apos;re not satisfied with the programme, you&apos;ll get a full refund.
              </span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Link id="enroll" href="#" className="cert-enroll-btn" style={{ display: 'inline-flex' }}>
                Enroll for $499 (or $399 early bird) <IcoArrow />
              </Link>
            </div>
          </motion.div>
        </section>

        <div className="cert-divider" />

        {/* Who takes SCARL */}
        <section className="cert-section">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
            <div className="cert-section-label">Who it&apos;s for</div>
            <h2 className="cert-section-title">Three types of people take SCARL</h2>
          </motion.div>
          <div className="cert-personas">
            {PERSONAS.map((p, i) => (
              <motion.div key={i} className="cert-persona" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.08 }}>
                <div className="cert-persona-icon">{p.icon}</div>
                <div className="cert-persona-title">{p.title}</div>
                <div className="cert-persona-desc">{p.desc}</div>
              </motion.div>
            ))}
          </div>
        </section>

        <div className="cert-divider" />

        {/* Testimonials */}
        <section className="cert-section">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
            <div className="cert-section-label">From SCARL graduates</div>
            <h2 className="cert-section-title">What it changed for them</h2>
          </motion.div>
          <div className="cert-testimonials">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i} className="cert-testimonial" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.08 }}>
                <p className="cert-testimonial-text">{t.text}</p>
                <div className="cert-testimonial-author">
                  <div className="cert-testimonial-avatar"><IcoUser /></div>
                  <div>
                    <div className="cert-testimonial-name">{t.name}</div>
                    <div className="cert-testimonial-role">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <div className="cert-divider" />

        {/* FAQ */}
        <section className="cert-section">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
            <div className="cert-section-label">Before you enroll</div>
            <h2 className="cert-section-title">Common questions</h2>
          </motion.div>
          <div className="cert-faq">
            {FAQS.map((item, i) => <FaqItem key={i} q={item.q} a={item.a} />)}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="cert-cta">
          <div className="cert-cta-inner">
            <motion.h2 className="cert-cta-title" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
              Join the next cohort.
            </motion.h2>
            <motion.p className="cert-cta-sub" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.08 }}>
              6 weeks. No technical background required. Practical assessment. Digital badge. Genuine change in how you lead technology decisions.
            </motion.p>
            <motion.div className="cert-cta-row" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.12 }}>
              <Link href="#enroll" className="cert-enroll-btn">
                Enroll for $499 <IcoArrow />
              </Link>
              <Link href="#" className="cert-cta-ghost">
                <IcoDownload /> Download the syllabus
              </Link>
            </motion.div>
            <motion.p className="cert-cta-note" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.2 }}>
              Next cohort starts <strong>May 1, 2026</strong>. <strong>14 seats remaining</strong>. Early bird price ($399) until April 15.
            </motion.p>
          </div>
        </section>

      </main>
    </>
  );
}
