'use client';

import { useParams, notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const A = '#72C4B2';
const F = {
  h: "var(--font-manrope,'Manrope'),sans-serif",
  b: "var(--font-dm-sans,'DM Sans'),sans-serif",
  m: "var(--font-jb-mono,'JetBrains Mono'),monospace",
};
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const STYLES = `
  .cs-page { background: var(--bg); min-height: 100vh; }

  .cs-hero {
    padding: clamp(100px,12vw,160px) 32px 60px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .cs-label {
    font-family: ${F.m};
    font-size: 0.72rem;
    font-weight: 500;
    color: ${A};
    text-transform: uppercase;
    letter-spacing: 0.12em;
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
  }
  .cs-label::before {
    content: '';
    width: 20px;
    height: 1.5px;
    background: ${A};
    display: inline-block;
    flex-shrink: 0;
  }

  .cs-hero-badges {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 24px;
  }
  .cs-badge {
    font-family: ${F.m};
    font-size: 0.65rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 5px 12px;
    border-radius: 100px;
    border: 1px solid ${A}44;
    color: ${A};
    background: ${A}11;
  }

  .cs-hero-title {
    font-family: ${F.h};
    font-size: clamp(2rem,4vw,3rem);
    font-weight: 800;
    color: var(--text-primary);
    letter-spacing: -0.03em;
    line-height: 1.08;
    margin: 0 0 24px;
    max-width: 820px;
  }

  .cs-hero-metrics {
    display: flex;
    align-items: center;
    gap: 40px;
    flex-wrap: wrap;
    padding-top: 32px;
    border-top: 1px solid var(--border);
    margin-top: 32px;
  }
  .cs-hero-metric-val {
    font-family: ${F.m};
    font-size: 1.4rem;
    font-weight: 600;
    color: ${A};
    display: block;
    margin-bottom: 4px;
  }
  .cs-hero-metric-lab {
    font-family: ${F.b};
    font-size: 0.8rem;
    color: var(--text-muted);
  }

  /* Content sections */
  .cs-body {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 32px 80px;
  }
  .cs-section {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 60px;
    padding: 60px 0;
    border-bottom: 1px solid var(--border);
  }
  .cs-section:last-of-type { border-bottom: none; }

  .cs-section-label {
    font-family: ${F.m};
    font-size: 0.72rem;
    font-weight: 500;
    color: ${A};
    text-transform: uppercase;
    letter-spacing: 0.12em;
    padding-top: 6px;
  }

  .cs-section-title {
    font-family: ${F.h};
    font-size: clamp(1.4rem,2.5vw,1.8rem);
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.02em;
    margin: 0 0 20px;
    line-height: 1.2;
  }

  .cs-body-text {
    font-family: ${F.b};
    font-size: 1rem;
    color: var(--text-secondary);
    line-height: 1.75;
    margin: 0 0 16px;
  }
  .cs-body-text:last-child { margin-bottom: 0; }

  /* Stack pills */
  .cs-stack-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 16px;
  }
  .cs-stack-pill {
    font-family: ${F.m};
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.06em;
    padding: 6px 14px;
    border-radius: 100px;
    background: var(--bg-2);
    border: 1px solid var(--border);
    color: var(--text-secondary);
  }

  /* Results metrics */
  .cs-results-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-bottom: 32px;
  }
  .cs-result-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 24px;
  }
  .cs-result-val {
    font-family: ${F.h};
    font-size: 2rem;
    font-weight: 800;
    color: ${A};
    letter-spacing: -0.02em;
    display: block;
    margin-bottom: 6px;
  }
  .cs-result-lab {
    font-family: ${F.b};
    font-size: 0.84rem;
    color: var(--text-muted);
    line-height: 1.4;
  }

  /* Quote glass card */
  .cs-quote-card {
    background: ${A}08;
    border: 1px solid ${A}22;
    border-radius: 20px;
    padding: 32px;
    position: relative;
  }
  .cs-quote-mark {
    font-family: ${F.h};
    font-size: 4rem;
    line-height: 1;
    color: ${A};
    opacity: 0.3;
    position: absolute;
    top: 16px;
    left: 24px;
    font-weight: 800;
  }
  .cs-quote-text {
    font-family: ${F.b};
    font-size: 1.05rem;
    color: var(--text-primary);
    line-height: 1.75;
    font-style: italic;
    margin: 0 0 20px;
    padding-top: 24px;
  }
  .cs-quote-author {
    font-family: ${F.m};
    font-size: 0.78rem;
    font-weight: 500;
    color: ${A};
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .cs-quote-role {
    font-family: ${F.b};
    font-size: 0.78rem;
    color: var(--text-muted);
    margin-top: 2px;
  }

  /* Related cards */
  .cs-related-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  .cs-related-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
    text-decoration: none;
    transition: border-color 0.3s, transform 0.3s;
  }
  .cs-related-card:hover {
    border-color: var(--border-hover);
    transform: translateY(-4px);
  }
  .cs-related-thumb {
    width: 100%;
    height: 140px;
    overflow: hidden;
    background: linear-gradient(135deg, #3A589E22, ${A}22);
  }
  .cs-related-thumb img {
    width: 100%; height: 100%; object-fit: cover; display: block;
    transition: transform 0.5s cubic-bezier(0.16,1,0.3,1);
  }
  .cs-related-card:hover .cs-related-thumb img { transform: scale(1.05); }
  .cs-related-body { padding: 22px 28px 28px; }
  .cs-related-name {
    font-family: ${F.h};
    font-size: 1rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 8px;
    letter-spacing: -0.01em;
  }
  .cs-related-desc {
    font-family: ${F.b};
    font-size: 0.84rem;
    color: var(--text-secondary);
    line-height: 1.6;
    margin: 0;
  }

  /* CTA */
  .cs-cta {
    background: var(--bg-2);
    border-top: 1px solid var(--border);
    padding: 100px 32px;
    text-align: center;
  }
  .cs-cta-inner { max-width: 600px; margin: 0 auto; }
  .cs-cta-title {
    font-family: ${F.h};
    font-size: clamp(1.8rem,3vw,2.2rem);
    font-weight: 800;
    color: var(--text-primary);
    letter-spacing: -0.02em;
    margin: 0 0 16px;
  }
  .cs-cta-sub {
    font-family: ${F.b};
    font-size: 1rem;
    color: var(--text-secondary);
    margin: 0 0 40px;
    line-height: 1.7;
  }
  .cs-cta-btns {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
    flex-wrap: wrap;
  }
  .btn-primary {
    font-family: ${F.h};
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    padding: 14px 28px;
    background: linear-gradient(135deg, #3A589E, ${A});
    color: white;
    border: none;
    border-radius: 100px;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 4px 24px rgba(58,88,158,0.35);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .btn-primary:hover {
    transform: translateY(-3px) scale(1.03);
    box-shadow: 0 10px 40px rgba(58,88,158,0.5);
  }
  .btn-ghost {
    font-family: ${F.h};
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    padding: 13px 28px;
    background: transparent;
    color: var(--text-primary);
    border: 1.5px solid var(--border);
    border-radius: 100px;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: border-color 0.2s, color 0.2s;
  }
  .btn-ghost:hover {
    border-color: ${A};
    color: ${A};
  }

  .cs-back {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: ${F.b};
    font-size: 0.84rem;
    color: var(--text-muted);
    text-decoration: none;
    transition: color 0.2s;
    margin-bottom: 32px;
  }
  .cs-back:hover { color: ${A}; }

  @media (max-width: 900px) {
    .cs-section { grid-template-columns: 1fr; gap: 20px; }
    .cs-results-grid { grid-template-columns: 1fr 1fr; }
    .cs-related-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 600px) {
    .cs-hero { padding: 100px 20px 40px; }
    .cs-body { padding: 0 20px 60px; }
    .cs-hero-metrics { gap: 24px; }
    .cs-results-grid { grid-template-columns: 1fr; }
  }
`;

type Metric = { label: string; value: string };
type ProjectData = {
  name: string;
  client: string;
  industry: string;
  category: string;
  problem: string;
  solution: string;
  stack: string[];
  metrics: Metric[];
  timeline: string;
  price: string;
  quote: { text: string; author: string; role: string };
  related: { slug: string; name: string; desc: string }[];
};

const PROJECTS: Record<string, ProjectData> = {
  inboxflow: {
    name: 'InboxFlow',
    client: 'Solo founder',
    industry: 'SaaS / Productivity',
    category: 'Products',
    problem: 'The founder had spent 3 months with AI coding tools and got 70% of the product done. But it wouldn\'t deploy — a combination of architecture issues, missing authentication, and no payment system. The code worked locally but fell apart under any real-world conditions.',
    solution: 'We audited the existing codebase, preserved 70% of what worked, rebuilt the data architecture, added Stripe payments with full webhook handling, implemented JWT auth with proper server-side session management, and deployed to Railway with staging and production environments — in 18 days.',
    stack: ['Next.js', 'FastAPI', 'PostgreSQL', 'Stripe', 'Railway', 'JWT'],
    metrics: [
      { label: 'Shipped in', value: '18 days' },
      { label: 'Total cost', value: '$3,200' },
      { label: 'Existing code preserved', value: '70%' },
      { label: 'Status', value: 'Live in production' },
    ],
    timeline: '18 days',
    price: '$3,200',
    quote: {
      text: 'I was two weeks from giving up. SocioFi shipped it in 18 days and it\'s been running perfectly for 6 months.',
      author: 'Priya D.',
      role: 'Founder, InboxFlow',
    },
    related: [
      { slug: 'brightpath', name: 'BrightPath Ops Dashboard', desc: '30-person logistics company replaced spreadsheet operations with a custom real-time dashboard.' },
      { slug: 'stylestack', name: 'StyleStack Matching Platform', desc: 'Personal styling service scaled from 100 to 500+ clients with an AI-powered matching system.' },
    ],
  },
  brightpath: {
    name: 'BrightPath Ops Dashboard',
    client: 'BrightPath Logistics',
    industry: 'Logistics / Operations',
    category: 'Internal Tools',
    problem: 'A 30-person logistics company was tracking all operations in Google Sheets — 4+ hours per day of manual data entry across 3 spreadsheets that kept going out of sync. Managers had no real-time visibility. Reporting that should take seconds was a 2-hour manual process.',
    solution: 'Custom operations dashboard with real-time data from all operations, automated data entry from their existing carrier systems, and a reporting engine that compiles any report in seconds. The team onboarded in one day and cut manual entry to near zero.',
    stack: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'Vercel', 'REST APIs'],
    metrics: [
      { label: 'Delivery time', value: '3 weeks' },
      { label: 'Hours per week saved', value: '20 hrs' },
      { label: 'Return on investment', value: 'ROI in 30 days' },
      { label: 'Active users at launch', value: '30 users' },
    ],
    timeline: '3 weeks',
    price: 'Fixed scope',
    quote: {
      text: 'We got quotes of $80K and 4 months from agencies. SocioFi delivered in 3 weeks for a fraction of that. The team was using it on day one.',
      author: 'Marcus T.',
      role: 'COO, BrightPath Logistics',
    },
    related: [
      { slug: 'inboxflow', name: 'InboxFlow', desc: 'AI prototype rescue — 70% of existing code preserved, shipped in 18 days for $3,200.' },
      { slug: 'nexara', name: 'NEXARA GTM System', desc: '13 AI agents automating the entire go-to-market pipeline for a B2B SaaS company.' },
    ],
  },
  stylestack: {
    name: 'StyleStack Matching Platform',
    client: 'StyleStack',
    industry: 'Consumer / Personal Services',
    category: 'Products',
    problem: 'A personal styling service was managing client-stylist matching in Google Sheets. It worked at 50 clients. At 100 clients it started breaking — wrong assignments, missed bookings, no visibility into stylist availability. Growth had stalled because the operations couldn\'t scale.',
    solution: 'An AI-powered matching platform that automatically pairs clients with stylists based on style preferences, availability, and past feedback. A client portal for booking and communication, and an admin dashboard for the operations team. The platform handles everything the spreadsheet couldn\'t.',
    stack: ['Next.js', 'Python', 'PostgreSQL', 'OpenAI API', 'Stripe', 'Vercel'],
    metrics: [
      { label: 'Delivery time', value: '4 weeks' },
      { label: 'Client capacity increase', value: '5x' },
      { label: 'Match accuracy', value: '94%' },
      { label: 'Status', value: 'Live' },
    ],
    timeline: '4 weeks',
    price: 'Fixed scope',
    quote: {
      text: 'We couldn\'t grow because our operations were the bottleneck. Now the platform handles everything. We onboarded 400 new clients last quarter.',
      author: 'Sarah K.',
      role: 'CEO, StyleStack',
    },
    related: [
      { slug: 'inboxflow', name: 'InboxFlow', desc: 'AI prototype rescue — 70% of existing code preserved, shipped in 18 days for $3,200.' },
      { slug: 'brightpath', name: 'BrightPath Ops Dashboard', desc: '30-person logistics company saved 20 hours per week with a custom real-time dashboard.' },
    ],
  },
  nexara: {
    name: 'NEXARA GTM System',
    client: 'NEXARA',
    industry: 'B2B SaaS',
    category: 'Products',
    problem: 'A B2B SaaS company was executing their go-to-market manually — prospecting in spreadsheets, sending outreach one by one, tracking pipeline in a disconnected CRM, and compiling reports by hand. The sales team was spending 60% of their time on process instead of selling.',
    solution: '13 AI agents managing the entire go-to-market pipeline: prospect identification, outreach sequencing, lead scoring, pipeline management, and reporting. The sales team now focuses exclusively on conversations with qualified prospects — the agents handle everything else.',
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Celery', 'Next.js', 'AI APIs'],
    metrics: [
      { label: 'AI agents deployed', value: '13 agents' },
      { label: 'Outreach volume increase', value: '8x' },
      { label: 'Sales team time on selling', value: '90%' },
      { label: 'Pipeline visibility', value: 'Real-time' },
    ],
    timeline: '6 weeks',
    price: 'Custom scope',
    quote: {
      text: 'Our reps used to spend half their day on admin. Now the system handles everything end to end. We doubled pipeline in 60 days.',
      author: 'James R.',
      role: 'VP Sales, NEXARA',
    },
    related: [
      { slug: 'inboxflow', name: 'InboxFlow', desc: 'AI prototype rescue — 70% of existing code preserved, shipped in 18 days for $3,200.' },
      { slug: 'brightpath', name: 'BrightPath Ops Dashboard', desc: '30-person logistics company saved 20 hours per week with a custom real-time dashboard.' },
    ],
  },

  // ── Automation ────────────────────────────────────────────────────────────────
  recruitflow: {
    name: 'RecruitFlow Hiring Pipeline',
    client: 'Apex Talent Solutions',
    industry: 'Staffing / HR Tech',
    category: 'Automation',
    problem: 'Apex Talent Solutions runs 20 recruiters placing candidates across finance and tech roles. Their process was entirely manual — every CV was read by a person, every interview invitation typed by hand, and every status update emailed one by one. With 40 active roles at any given time, a single recruiter was spending close to three hours a day just on screening and communication before they had a single meaningful conversation with a candidate. Growth had hit a ceiling: to take on more roles they would need to hire another coordinator, which erased the margin on new business.',
    solution: 'We built an end-to-end hiring automation pipeline. When a CV lands, an AI agent screens it against the role criteria and scores it on a 0–100 scale with a plain-English summary of fit and gaps. Candidates who score above the threshold are automatically sent a personalised availability request that syncs with the recruiter\'s Google Calendar — the first interview slot is booked without any human involvement. Candidates below the threshold receive a thoughtful rejection email referencing specific aspects of the role. The recruiter\'s day now starts with a ranked shortlist and a calendar already partially booked. The system also logs every decision so the team can tune criteria over time. Deployed and handling live roles in 2 weeks.',
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'Google Calendar API', 'SendGrid', 'Next.js', 'Vercel', 'OpenAI API'],
    metrics: [
      { label: 'Screening time saved', value: '85%' },
      { label: 'Active role capacity', value: '200+ roles' },
      { label: 'Coordinator hours freed / week', value: '18 hrs' },
      { label: 'Deployed in', value: '2 weeks' },
    ],
    timeline: '2 weeks',
    price: 'Fixed scope',
    quote: {
      text: 'We went from 40 active roles to over 200 with the same team. The pipeline handles everything up to the first real conversation — and that\'s exactly where our recruiters should be spending their time.',
      author: 'Natalie F.',
      role: 'Operations Director, Apex Talent Solutions',
    },
    related: [
      { slug: 'ordersync', name: 'OrderSync Fulfillment Automation', desc: 'DTC e-commerce: routing errors eliminated, 6 hrs/day freed, 99.2% on-time dispatch.' },
      { slug: 'brightpath', name: 'BrightPath Ops Dashboard', desc: '30-person logistics company saved 20 hours per week with a custom real-time dashboard.' },
    ],
  },

  ordersync: {
    name: 'OrderSync Fulfillment Automation',
    client: 'DTC brand (anonymised at client request)',
    industry: 'E-Commerce / Fulfilment',
    category: 'Automation',
    problem: 'A direct-to-consumer brand processing 300+ orders per day was routing every order manually. They had three fulfilment centres — each handling different product categories and shipping zones — and a coordinator who spent most of the working day deciding which centre to send each order to, then entering it into the right portal. The logic wasn\'t complicated, but it was relentless. Mistakes happened every day: wrong centre, wrong carrier, delayed dispatch. Customer service spent half its time on "where is my order" tickets. The coordinator had become the bottleneck for the entire operation.',
    solution: 'We built a rules engine that sits between Shopify and all three fulfilment portals. Every incoming order is evaluated in real time against product type, live stock levels at each centre, and shipping zone logic. The right fulfilment portal receives the order automatically with zero human input. Edge cases — out-of-stock, split shipments, address flags — trigger a Slack alert with all context so the coordinator makes one decision instead of three hundred. The system also generates a daily dispatch report and tracks carrier performance over time. Routing errors dropped to zero in the first week.',
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Shopify API', 'Slack API', 'Railway', 'Celery'],
    metrics: [
      { label: 'Routing errors / week', value: '0' },
      { label: 'Coordinator time freed / day', value: '6 hrs' },
      { label: 'On-time dispatch rate', value: '99.2%' },
      { label: 'Deployed in', value: '10 days' },
    ],
    timeline: '10 days',
    price: '$2,800',
    quote: {
      text: 'Our coordinator went from firefighting all day to reviewing a Slack summary in the morning. The routing errors just stopped. We haven\'t had a misdirected order in four months.',
      author: 'Tom W.',
      role: 'Head of Operations',
    },
    related: [
      { slug: 'recruitflow', name: 'RecruitFlow Hiring Pipeline', desc: 'Staffing agency automated CV screening and interview scheduling, tripling active role capacity.' },
      { slug: 'brightpath', name: 'BrightPath Ops Dashboard', desc: '30-person logistics company saved 20 hours per week with a custom real-time dashboard.' },
    ],
  },

  // ── Rescue ────────────────────────────────────────────────────────────────────
  healthtrack: {
    name: 'HealthTrack App Rescue',
    client: 'HealthTrack (name changed at client request)',
    industry: 'Health & Wellness',
    category: 'Rescue',
    problem: 'HealthTrack had just closed a Series A. The app — a habit tracking and coaching platform — had been built over 18 months by an external agency at a cost of $80,000. It launched to strong early interest, then fell apart. Under 200 concurrent users the API started returning errors. Data sync between devices broke intermittently. Payment webhooks failed silently, meaning users were being charged without their subscriptions activating. The engineering contact at the agency had left the company. Investors were watching closely. The team had two weeks before a scheduled press mention would bring a spike in traffic they couldn\'t handle.',
    solution: 'We started with a full architecture audit rather than a rebuild — the underlying data model was sound, the problems were concentrated in specific areas. Database query analysis revealed 14 unindexed queries that were doing full-table scans on tables with 500k+ rows; adding the right indexes alone cut average API response time by 64%. WebSocket connection pooling was rewritten to handle load spikes without cascading failures. The payment webhook handler was made idempotent with proper retry logic and a reconciliation job to fix the 340 users whose subscriptions had silently failed. Monitoring and alerting were set up for the first time — the team had been discovering issues from user complaints rather than dashboards. Three weeks after we started, the app handled a 5,000 concurrent user spike without a single error.',
    stack: ['React Native', 'FastAPI', 'PostgreSQL', 'Redis', 'AWS EC2', 'AWS RDS', 'Stripe', 'WebSockets', 'Sentry', 'Datadog'],
    metrics: [
      { label: 'Concurrent users (stable)', value: '5,000+' },
      { label: 'API response time improvement', value: '64% faster' },
      { label: 'Data loss since fix', value: '$0' },
      { label: 'Stabilised in', value: '3 weeks' },
    ],
    timeline: '3 weeks',
    price: '$8,500',
    quote: {
      text: 'We were days away from a PR crisis. They audited everything, fixed the actual root causes, and had us stable before the press hit. The app has handled every spike since without a single incident.',
      author: 'Riya M.',
      role: 'CTO, HealthTrack',
    },
    related: [
      { slug: 'brandforge', name: 'BrandForge Platform Rescue', desc: '14 critical issues fixed in an AI-generated codebase — auth, file uploads, error handling — back in production in 12 days.' },
      { slug: 'inboxflow', name: 'InboxFlow', desc: 'AI prototype rescue — 70% of existing code preserved, shipped in 18 days for $3,200.' },
    ],
  },

  brandforge: {
    name: 'BrandForge Platform Rescue',
    client: 'BrandForge',
    industry: 'B2B SaaS',
    category: 'Rescue',
    problem: 'BrandForge\'s technical co-founder had built the MVP using AI coding tools over two months. In development it worked perfectly. In production, three things broke immediately: the authentication system issued tokens that expired inconsistently, causing random logouts; file uploads (central to the product — users upload brand assets for AI processing) corrupted about 1 in 8 files silently, meaning users received processed output based on broken input; and the entire codebase had been generated without any error handling, so when something failed the user saw a blank screen and the team had no logs to investigate with. The product had been submitted to Product Hunt. The launch was 10 days away.',
    solution: 'We ran a systematic code audit using SENTINEL, our automated analysis agent, which flagged 14 critical issues across security, data integrity, and reliability. We prioritised by impact and worked through them in two parallel tracks. Auth was rebuilt with proper token rotation, refresh logic, and secure session storage — all existing user sessions were migrated without forcing re-logins. The file upload pipeline was rewritten with chunk verification, integrity checks, and an async retry queue so corrupted uploads are detected and re-requested rather than processed silently. Error boundaries were added throughout the React frontend, and a structured logging system was set up so every server-side failure writes a searchable log entry. We also added Sentry for real-time error monitoring. The team deployed to production on day 12 with a clean audit report. The Product Hunt launch went ahead on schedule. The app currently holds a 4.8-star App Store rating.',
    stack: ['Next.js', 'Node.js', 'PostgreSQL', 'AWS S3', 'JWT', 'Vercel', 'Sentry', 'Winston', 'React Error Boundaries'],
    metrics: [
      { label: 'Critical issues resolved', value: '14' },
      { label: 'Back in production', value: '12 days' },
      { label: 'App Store rating', value: '4.8 ★' },
      { label: 'Security incidents since fix', value: '0' },
    ],
    timeline: '12 days',
    price: '$4,200',
    quote: {
      text: 'The audit report alone was worth the cost — it told us exactly what was wrong and why, not just "it\'s broken." We launched on time, the app works, and for the first time we actually know what\'s happening inside our own product.',
      author: 'David L.',
      role: 'Co-founder, BrandForge',
    },
    related: [
      { slug: 'healthtrack', name: 'HealthTrack App Rescue', desc: 'Post-Series A app crashing at 200 users — stabilised to handle 5,000+ concurrent without a rebuild.' },
      { slug: 'inboxflow', name: 'InboxFlow', desc: 'AI prototype rescue — 70% of existing code preserved, shipped in 18 days for $3,200.' },
    ],
  },

  // ── Consulting ────────────────────────────────────────────────────────────────
  techpath: {
    name: 'TechPath Architecture Advisory',
    client: 'TechPath (pre-seed fintech)',
    industry: 'FinTech / Startup Advisory',
    category: 'Consulting',
    problem: 'The founder of TechPath had a clear product vision: a personal finance tool that helps first-generation professionals in emerging markets manage irregular income and build savings habits. She had validated the concept with 200 users on a no-code prototype built with Glide and Airtable. She had $120,000 in pre-seed funding from a regional angel group. And she had no idea what to do next. Every engineer she spoke to gave different advice — build native, build web-first, use Firebase, use PostgreSQL, build a microservice architecture from day one. One freelancer quoted $180,000 for a two-year build. She had 18 months of runway and needed to make decisions that would determine whether the company succeeded or failed, with no way to evaluate the advice she was getting.',
    solution: 'We ran a 4-week technical co-founder engagement. Week 1: deep product analysis — we mapped every feature of the no-code prototype, identified what was essential for launch versus what was premature, and built a prioritised feature list that separated the $20k MVP from the $120k full product. Week 2: architecture decision record — we evaluated and documented every major technical decision (stack, hosting, database, auth, payment infrastructure) with clear rationale she could present to any future engineer or investor. Week 3: specification — a 48-page technical document covering database schema, API contracts, third-party integrations, and infrastructure setup. Week 4: hiring — we wrote job descriptions, defined a screening process, and sat in on the first three engineer interviews. The founder hired a two-person engineering team six weeks after the engagement ended. They shipped the MVP in 11 weeks using the spec as their guide.',
    stack: ['Architecture Design', 'System Design', 'API Specification', 'Database Schema', 'Vendor Evaluation', 'Hiring Advisory', 'AWS', 'Next.js', 'PostgreSQL'],
    metrics: [
      { label: 'Engagement length', value: '4 weeks' },
      { label: 'Technical specification', value: '48 pages' },
      { label: 'MVP shipped after engagement', value: '11 weeks' },
      { label: 'Engineering team hired', value: '6 weeks post-engagement' },
    ],
    timeline: '4 weeks',
    price: '$6,000',
    quote: {
      text: 'Every engineer I spoke to before had an agenda. SocioFi\'s only interest was making sure I made the right decision for the product. The spec they delivered became the entire foundation of our engineering culture.',
      author: 'Amara N.',
      role: 'Founder, TechPath',
    },
    related: [
      { slug: 'mediflow', name: 'MediFlow Stack Audit', desc: 'Technical due diligence for a $4.2M healthcare SaaS acquisition — full audit and HIPAA assessment in 2 weeks.' },
      { slug: 'healthtrack', name: 'HealthTrack App Rescue', desc: 'Post-Series A app crashing at 200 users — stabilised to handle 5,000+ concurrent without a rebuild.' },
    ],
  },

  mediflow: {
    name: 'MediFlow Stack Audit',
    client: 'MediFlow (name changed at acquirer request)',
    industry: 'Healthcare SaaS',
    category: 'Consulting',
    problem: 'MediFlow, a patient communication SaaS serving outpatient clinics, had agreed on a $4.2M acquisition in principle. The acquirer — a healthcare group with a legal and compliance team — required full technical due diligence before signing. MediFlow\'s founding team was three people, none of them senior engineers. They had no architecture documentation, no formal security review, no written record of their HIPAA compliance controls, and no one capable of producing what the acquirer needed in the two-week window before the deal would expire. The acquisition represented four years of work. The timeline was the only obstacle.',
    solution: 'We assembled a structured due diligence package across four workstreams running in parallel. Security review: full codebase scan for vulnerabilities, dependency audit, authentication and authorisation analysis, data-at-rest and in-transit encryption verification. HIPAA compliance: documented Business Associate Agreement status, audit log coverage, access control mapping, and breach notification procedure. Architecture documentation: produced system architecture diagrams, data flow maps, API documentation, and a database schema reference from the existing codebase. Plain-English executive summary: translated all findings into a 12-page document written for the non-technical acquiring team\'s board, distinguishing between findings that required remediation before close and observations that could be addressed post-acquisition. We found no deal-blocking issues — the codebase was more solid than the team\'s documentation suggested. The acquirer\'s technical reviewer signed off at the end of week two. The acquisition closed on schedule.',
    stack: ['Security Audit', 'HIPAA Compliance Review', 'Architecture Documentation', 'Code Analysis', 'Dependency Audit', 'Technical Due Diligence Report'],
    metrics: [
      { label: 'Audit delivered in', value: '2 weeks' },
      { label: 'Acquisition value', value: '$4.2M' },
      { label: 'Deal-blocking issues found', value: '0' },
      { label: 'Documentation produced', value: '62 pages' },
    ],
    timeline: '2 weeks',
    price: '$5,500',
    quote: {
      text: 'We had two weeks and four years on the line. SocioFi produced documentation in 14 days that we couldn\'t have produced ourselves in six months. The deal closed without a single issue raised by the acquirer\'s technical team.',
      author: 'Chris O.',
      role: 'CEO, MediFlow',
    },
    related: [
      { slug: 'techpath', name: 'TechPath Architecture Advisory', desc: 'Pre-seed fintech founder got a 48-page technical spec and a hired engineering team in 4 weeks.' },
      { slug: 'brandforge', name: 'BrandForge Platform Rescue', desc: '14 critical issues fixed in an AI-generated codebase — back in production in 12 days.' },
    ],
  },
};

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 7h10M7 2l5 5-5 5" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 7H2M7 2L2 7l5 5" />
    </svg>
  );
}

function NotFoundMessage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 24, padding: 32 }}>
      <h1 style={{ fontFamily: F.h, fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Project not found</h1>
      <Link href="/studio/portfolio" style={{ fontFamily: F.b, color: A, textDecoration: 'none' }}>Back to portfolio</Link>
    </div>
  );
}

export default function PortfolioSlugPage() {
  const params = useParams();
  const slug = typeof params?.slug === 'string' ? params.slug : Array.isArray(params?.slug) ? params.slug[0] : '';

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return <div style={{ minHeight: '100vh', background: 'var(--bg)' }} />;
  }

  const project = PROJECTS[slug];
  if (!project) return <NotFoundMessage />;

  const fadein = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: EASE, delay },
  });

  const inview = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 as const },
    transition: { duration: 0.7, ease: EASE },
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="cs-page">

        {/* Hero */}
        <section className="cs-hero">
          <motion.div {...fadein(0)}>
            <Link href="/studio/portfolio" className="cs-back">
              <BackIcon />
              Back to Portfolio
            </Link>
          </motion.div>

          <motion.div {...fadein(0.05)}>
            <p className="cs-label">Case Study</p>
          </motion.div>

          <motion.div {...fadein(0.1)}>
            <div className="cs-hero-badges">
              <span className="cs-badge">{project.industry}</span>
              <span className="cs-badge">{project.category}</span>
            </div>
            <h1 className="cs-hero-title">{project.name}</h1>
            <p style={{ fontFamily: F.b, fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
              Client: {project.client}
            </p>
          </motion.div>

          <motion.div {...fadein(0.15)}>
            <div className="cs-hero-metrics">
              {project.metrics.map((m) => (
                <div key={m.label}>
                  <span className="cs-hero-metric-val">{m.value}</span>
                  <span className="cs-hero-metric-lab">{m.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Body */}
        <div className="cs-body">

          {/* The Problem */}
          <motion.div className="cs-section" {...inview}>
            <div>
              <p className="cs-section-label">The Problem</p>
            </div>
            <div>
              <h2 className="cs-section-title">The situation before we were involved</h2>
              <p className="cs-body-text">{project.problem}</p>
            </div>
          </motion.div>

          {/* The Solution */}
          <motion.div className="cs-section" {...inview}>
            <div>
              <p className="cs-section-label">The Solution</p>
            </div>
            <div>
              <h2 className="cs-section-title">What we built</h2>
              <p className="cs-body-text">{project.solution}</p>
            </div>
          </motion.div>

          {/* Technical Details */}
          <motion.div className="cs-section" {...inview}>
            <div>
              <p className="cs-section-label">Technical Details</p>
            </div>
            <div>
              <h2 className="cs-section-title">Stack and architecture</h2>
              <p className="cs-body-text">Every technology choice was made for a reason — performance, cost, or long-term maintainability. All code is documented and transferred in full.</p>
              <div className="cs-stack-pills">
                {project.stack.map((s) => (
                  <span key={s} className="cs-stack-pill">{s}</span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div className="cs-section" {...inview}>
            <div>
              <p className="cs-section-label">Results</p>
            </div>
            <div>
              <h2 className="cs-section-title">What changed</h2>
              <div className="cs-results-grid">
                {project.metrics.map((m) => (
                  <div key={m.label} className="cs-result-card">
                    <span className="cs-result-val">{m.value}</span>
                    <span className="cs-result-lab">{m.label}</span>
                  </div>
                ))}
              </div>
              <div className="cs-quote-card">
                <span className="cs-quote-mark" aria-hidden="true">"</span>
                <p className="cs-quote-text">{project.quote.text}</p>
                <p className="cs-quote-author">{project.quote.author}</p>
                <p className="cs-quote-role">{project.quote.role}</p>
              </div>
            </div>
          </motion.div>

          {/* Related Projects */}
          <motion.div className="cs-section" {...inview}>
            <div>
              <p className="cs-section-label">Related Projects</p>
            </div>
            <div>
              <h2 className="cs-section-title">Similar work</h2>
              <div className="cs-related-grid">
                {project.related.map((r) => (
                  <Link key={r.slug} href={`/studio/portfolio/${r.slug}`} className="cs-related-card">
                    <div className="cs-related-thumb" aria-hidden="true" style={{ position: 'relative' }}>
                      <Image src={`/images/portfolio/${r.slug}.jpg`} alt="" fill style={{ objectFit: 'cover' }} />
                    </div>
                    <div className="cs-related-body">
                      <h3 className="cs-related-name">{r.name}</h3>
                      <p className="cs-related-desc">{r.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

        </div>

        {/* CTA */}
        <section className="cs-cta">
          <div className="cs-cta-inner">
            <motion.div {...inview}>
              <p className="cs-label" style={{ justifyContent: 'center' }}>Start a project</p>
              <h2 className="cs-cta-title">Start a similar project</h2>
              <p className="cs-cta-sub">Tell us what you need. We scope it, price it, and build it — in plain English, on a fixed timeline.</p>
              <div className="cs-cta-btns">
                <Link href="/studio/start-project" className="btn-primary">
                  Start Your Project
                  <ArrowIcon />
                </Link>
                <Link href="/studio/portfolio" className="btn-ghost">
                  See More Work
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

      </div>
    </>
  );
}
