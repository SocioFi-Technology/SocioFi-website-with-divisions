'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

// ── Design tokens ─────────────────────────────────────────────────────────────
const A = '#E8B84D';
const F = {
  h: "var(--font-manrope,'Manrope'),sans-serif",
  b: "var(--font-dm-sans,'DM Sans'),sans-serif",
  m: "var(--font-jb-mono,'JetBrains Mono'),monospace",
};

// ── Data ──────────────────────────────────────────────────────────────────────
const WORKSHOPS = [
  { slug: 'ai-development-101-q-a', name: 'AI Development 101: Live Q&A', format: 'webinar', date: '2026-04-08', day: '08', month: 'APR', year: '2026', time: '2:00 PM – 3:30 PM BST', duration: '90 minutes', price: 0, maxSeats: 100, seatsRemaining: 67, description: 'Monthly live Q&A where SocioFi engineers answer questions about AI development and agents.' },
  { slug: 'spec-writing-workshop', name: 'Spec Writing Workshop', format: 'workshop', date: '2026-04-22', day: '22', month: 'APR', year: '2026', time: '10:00 AM – 1:00 PM BST', duration: '3 hours', price: 99, maxSeats: 30, seatsRemaining: 12, description: 'Hands-on workshop: write a real product spec with expert guidance and live feedback.' },
  { slug: 'agent-deployment-walkthrough', name: 'Agent Deployment Walkthrough', format: 'workshop', date: '2026-05-06', day: '06', month: 'MAY', year: '2026', time: '3:00 PM – 5:00 PM BST', duration: '2 hours', price: 79, maxSeats: 40, seatsRemaining: 28, description: 'Live demonstration of deploying AI agents into real business workflows.' },
  { slug: 'founders-build-sprint', name: "Founder's Build Sprint", format: 'sprint', date: '2026-05-19', day: '19', month: 'MAY', year: '2026', time: '9:00 AM – 11:00 AM BST (3 days)', duration: '3 × 2 hours', price: 249, maxSeats: 20, seatsRemaining: 8, description: '3-day intensive: go from business idea to fully scoped project brief with engineer coaching.' },
  { slug: 'technical-literacy-bootcamp', name: 'Technical Literacy Bootcamp', format: 'workshop', date: '2026-06-03', day: '03', month: 'JUN', year: '2026', time: '9:00 AM – 3:00 PM BST', duration: 'Full day (6 hours)', price: 199, maxSeats: 25, seatsRemaining: 19, description: 'Full-day immersive bootcamp covering the complete technical literacy curriculum.' },
  { slug: 'corporate-ai-readiness', name: 'Corporate AI Readiness Assessment', format: 'corporate', date: '2026-06-17', day: '17', month: 'JUN', year: '2026', time: '10:00 AM – 2:00 PM BST', duration: 'Half day (4 hours)', price: 499, maxSeats: 15, seatsRemaining: 15, description: 'Private half-day session for your team to assess AI readiness and build an adoption plan.' },
  { slug: 'ai-dev-q-a-march', name: 'AI Development 101: Live Q&A (March)', format: 'webinar', date: '2026-03-11', day: '11', month: 'MAR', year: '2026', time: '2:00 PM – 3:30 PM BST', duration: '90 minutes', price: 0, maxSeats: 100, seatsRemaining: 0, description: 'Recording available.' },
  { slug: 'spec-writing-feb', name: 'Spec Writing Workshop (February)', format: 'workshop', date: '2026-02-18', day: '18', month: 'FEB', year: '2026', time: '10:00 AM – 1:00 PM BST', duration: '3 hours', price: 99, maxSeats: 30, seatsRemaining: 0, description: 'Recording available to enrolled students.' },
];

type Workshop = typeof WORKSHOPS[0];

// Per-workshop extended content
const WORKSHOP_CONTENT: Record<string, {
  expect: string[];
  personas: { title: string; desc: string }[];
  sessions?: { title: string; time: string; desc: string }[];
  instructorName: string;
  instructorRole: string;
  instructorBio: string;
  faq?: { q: string; a: string }[];
}> = {
  'ai-development-101-q-a': {
    expect: [
      'Open Q&A format — bring any question, no topic off limits',
      'SocioFi engineers answer live, with context from real client projects',
      'Recorded and sent to all registrants within 24 hours',
      'No slides, no sales pitch — just direct answers to real questions',
    ],
    personas: [
      { title: 'The curious founder', desc: 'You\'ve heard about AI development and want to understand how it actually works before you commit to anything.' },
      { title: 'The early-stage builder', desc: 'You\'ve started experimenting with AI tools and have specific technical questions you can\'t easily find answers to online.' },
      { title: 'The evaluator', desc: 'Your business is considering AI development and you want to ask unfiltered questions before talking to any vendor.' },
    ],
    instructorName: 'SocioFi Engineering Team',
    instructorRole: 'AI Development Engineers',
    instructorBio: 'Our monthly Q&A is hosted by rotating engineers from the SocioFi team — people who build and maintain AI systems for clients every day. No pre-prepared answers. No marketing script.',
  },
  'spec-writing-workshop': {
    expect: [
      'Write a complete product spec for a real project you have in mind',
      'Live feedback from an engineer as you write — not after',
      'Learn the exact format SocioFi uses with clients',
      'Leave with a document you can actually use to brief a development team',
    ],
    personas: [
      { title: 'The founder with an idea', desc: 'You have a clear product concept but struggle to communicate it technically. This workshop gives you the format and language.' },
      { title: 'The PM without a dev team', desc: 'You write requirements for a living but want to understand what engineers actually need from a spec to build AI features.' },
      { title: 'The operator', desc: 'You\'re trying to brief a freelancer or agency on a project and need your brief to be taken seriously.' },
    ],
    instructorName: 'Kamrul Hasan',
    instructorRole: 'CTO, SocioFi Technology',
    instructorBio: 'Kamrul has reviewed hundreds of product specs and knows exactly what information engineers need to build accurately. He teaches this workshop because bad specs are the number one cause of project overruns.',
  },
  'agent-deployment-walkthrough': {
    expect: [
      'Watch a complete agent deployment from code to production in real time',
      'Follow along with your own setup or observe — both options work',
      'Ask questions throughout, not just at the end',
      'Understand every decision point in the deployment process',
    ],
    personas: [
      { title: 'The developer', desc: 'You\'ve built an agent locally and want to understand what changes when you deploy it to production.' },
      { title: 'The technical founder', desc: 'You want to understand the full deployment lifecycle before committing to an approach.' },
      { title: 'The engineering lead', desc: 'You\'re evaluating deployment patterns for a team project and want to see options in action.' },
    ],
    instructorName: 'SocioFi Engineering Team',
    instructorRole: 'AI Infrastructure Engineers',
    instructorBio: 'This walkthrough is run by the engineers who deploy AI agents for SocioFi clients — showing exactly how they approach production deployments.',
  },
  'founders-build-sprint': {
    expect: [
      'Day 1: Articulate your idea clearly and stress-test the core assumptions',
      'Day 2: Map the technical architecture with engineer guidance — no coding required',
      'Day 3: Write a complete project brief ready to hand to a development team',
      'Small group — max 20 founders, so everyone gets real attention',
    ],
    personas: [
      { title: 'The pre-product founder', desc: 'You have a business idea that involves software. You know what you want to build but not how to spec it or explain it to engineers.' },
      { title: 'The pivot-ready operator', desc: 'Your current tool isn\'t working and you want to build something custom. You need help turning a vague vision into a buildable brief.' },
      { title: 'The funding-ready builder', desc: 'You\'re preparing to raise and need a credible technical brief that shows investors you\'ve thought it through.' },
    ],
    sessions: [
      { title: 'Session 1: Idea Articulation', time: 'Day 1 · 9:00 AM – 11:00 AM BST', desc: 'Get precise about your idea. What problem does it solve? Who for? What does "working" look like? Engineer-guided structured thinking.' },
      { title: 'Session 2: Architecture Mapping', time: 'Day 2 · 9:00 AM – 11:00 AM BST', desc: 'Map the technical shape of your product. What does it need to do? What connects to what? No code — just clear thinking about structure.' },
      { title: 'Session 3: Brief Writing & Review', time: 'Day 3 · 9:00 AM – 11:00 AM BST', desc: 'Write the project brief, get live feedback from engineers, and leave with a document you can hand to any development team.' },
    ],
    instructorName: 'Arifur Rahman',
    instructorRole: 'CEO, SocioFi Technology',
    instructorBio: 'Arifur has helped dozens of non-technical founders turn product ideas into buildable briefs. He runs this sprint because the gap between "I have an idea" and "I can brief an engineer" is where most founders get stuck.',
  },
  'technical-literacy-bootcamp': {
    expect: [
      'Full-day coverage of the complete technical literacy curriculum in one intensive session',
      'How software actually gets built in 2026 — tools, processes, tradeoffs',
      'How to read a technical proposal and know if it makes sense',
      'Interactive exercises throughout — not 6 hours of listening',
      'Reference guide you keep and use after the session',
    ],
    personas: [
      { title: 'The non-technical founder', desc: 'You work with developers, freelancers, or agencies and sometimes feel like you\'re being sold to rather than informed.' },
      { title: 'The operations leader', desc: 'You manage systems and processes but don\'t have the technical vocabulary to brief engineers or evaluate their work confidently.' },
      { title: 'The aspiring SCARL candidate', desc: 'This bootcamp covers the first two weeks of the SCARL certification curriculum — it\'s the best on-ramp if you\'re considering the full programme.' },
    ],
    instructorName: 'Kamrul Hasan',
    instructorRole: 'CTO, SocioFi Technology',
    instructorBio: 'Kamrul designed the technical literacy curriculum after years of watching smart, capable people get steamrolled in technical conversations they didn\'t have to lose.',
  },
  'corporate-ai-readiness': {
    expect: [
      'Private session — just your team, no other companies',
      'AI readiness assessment: where you are vs where you want to be',
      'Gap analysis and prioritised action plan tailored to your business',
      'Candid answers to questions your team wouldn\'t ask in a public session',
      'Written report delivered within 3 business days of the session',
    ],
    personas: [
      { title: 'The innovation lead', desc: 'You\'ve been tasked with understanding AI and building a roadmap. You need substance, not a vendor pitch.' },
      { title: 'The senior leadership team', desc: 'Your board or executive team wants a grounded view of AI opportunity and risk relevant to your specific business.' },
      { title: 'The operations and IT team', desc: 'You need to understand what AI adoption actually looks like from a systems and process perspective.' },
    ],
    instructorName: 'Arifur Rahman & Kamrul Hasan',
    instructorRole: 'CEO & CTO, SocioFi Technology',
    instructorBio: 'Corporate sessions are run by SocioFi\'s founders directly. They\'ve conducted AI readiness assessments for companies ranging from 10 to 500 people across multiple industries.',
  },
  'ai-dev-q-a-march': {
    expect: [
      'Recording of the March session — 90 minutes of unscripted Q&A',
      'Topics covered: AI agent loops, deployment costs, spec quality, common failures',
      'No slides, no sales content — just direct answers from working engineers',
    ],
    personas: [
      { title: 'Missed the live session', desc: 'Watch at your own pace and see what questions other founders were asking.' },
    ],
    instructorName: 'SocioFi Engineering Team',
    instructorRole: 'AI Development Engineers',
    instructorBio: 'Recorded live with the SocioFi engineering team answering questions from 67 attendees.',
  },
  'spec-writing-feb': {
    expect: [
      'Full recording of the February workshop (3 hours)',
      'Follow along as participants write real specs with live engineer feedback',
      'Includes the spec template used in the session',
    ],
    personas: [
      { title: 'Enrolled students only', desc: 'Recording access is for enrolled students. Register for the next live session to gain access.' },
    ],
    instructorName: 'Kamrul Hasan',
    instructorRole: 'CTO, SocioFi Technology',
    instructorBio: 'Recorded live at the February workshop.',
  },
};

const DEFAULT_FAQ = [
  { q: 'Is this recorded?', a: 'Yes — all sessions are recorded and sent to registered participants within 24 hours, unless the recording is sold separately as a standalone product.' },
  { q: 'What platform is this on?', a: 'All sessions run on Zoom. You\'ll receive the link when you register, and a reminder 24 hours and 1 hour before the session.' },
  { q: 'What if I can\'t attend live?', a: 'Register anyway — the recording is sent to all registrants automatically within 24 hours of the session ending.' },
  { q: 'What\'s the refund policy?', a: 'Full refund if you cancel at least 48 hours before the session starts. After that, you\'ll receive the recording instead.' },
  { q: 'Is there a corporate version of this?', a: 'Yes — private sessions can be arranged for teams. See our corporate programme for details and pricing.' },
];

// ── Styles ────────────────────────────────────────────────────────────────────
const STYLES = `
  .wsd-page { background: var(--bg); min-height: 100vh; }

  /* Hero */
  .wsd-hero {
    padding: 120px 32px 80px;
    max-width: 1100px; margin: 0 auto;
    display: grid; grid-template-columns: 1fr 340px; gap: 60px;
    align-items: start;
  }
  .wsd-back {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: ${F.b}; font-size: 0.82rem; color: var(--text-muted);
    text-decoration: none; margin-bottom: 24px;
    transition: color 0.2s;
  }
  .wsd-back:hover { color: ${A}; }
  .wsd-date-badge {
    display: inline-flex; align-items: stretch; gap: 0;
    border-radius: 12px; overflow: hidden; margin-bottom: 20px;
  }
  .wsd-date-left {
    background: linear-gradient(180deg, #E8B84D, #D4A030);
    padding: 14px 20px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    min-width: 80px;
  }
  .wsd-date-day { font-family: ${F.h}; font-size: 2.4rem; font-weight: 800; color: #fff; line-height: 1; }
  .wsd-date-month { font-family: ${F.m}; font-size: 0.65rem; color: rgba(255,255,255,0.85); letter-spacing: 0.1em; margin-top: 2px; }
  .wsd-date-year { font-family: ${F.m}; font-size: 0.5rem; color: rgba(255,255,255,0.6); margin-top: 2px; }
  .wsd-date-right {
    background: var(--bg-card); border: 1px solid var(--border);
    padding: 14px 20px;
    display: flex; flex-direction: column; justify-content: center; gap: 4px;
  }
  .wsd-date-time { font-family: ${F.b}; font-size: 0.88rem; color: var(--text-primary); font-weight: 500; }
  .wsd-date-dur { font-family: ${F.m}; font-size: 0.65rem; color: var(--text-muted); letter-spacing: 0.06em; }
  .wsd-format-badge {
    display: inline-flex; align-items: center; gap: 4px;
    border: 1px solid rgba(232,184,77,0.4); border-radius: 100px;
    padding: 3px 12px; font-family: ${F.m}; font-size: 0.6rem;
    color: ${A}; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 16px;
  }
  .wsd-title {
    font-family: ${F.h}; font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 800;
    color: var(--text-primary); letter-spacing: -0.025em; line-height: 1.1; margin-bottom: 16px;
  }
  .wsd-desc { font-family: ${F.b}; font-size: 1rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 28px; }
  .wsd-register-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 14px 32px; border-radius: 10px;
    background: linear-gradient(135deg, #D4A030, #E8B84D);
    color: #1a1a1a; font-family: ${F.h}; font-size: 0.92rem; font-weight: 700;
    text-decoration: none; transition: transform 0.2s, box-shadow 0.2s;
  }
  .wsd-register-btn:hover { transform: translateY(-3px); box-shadow: 0 10px 32px rgba(232,184,77,0.4); }
  .wsd-register-btn.free {
    background: rgba(232,184,77,0.12); color: ${A};
    border: 1.5px solid rgba(232,184,77,0.4);
  }
  .wsd-register-btn.free:hover { background: rgba(232,184,77,0.2); box-shadow: none; }

  /* Stats sidebar */
  .wsd-stats {
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 16px; padding: 28px; position: sticky; top: 100px;
  }
  .wsd-stats-title { font-family: ${F.m}; font-size: 0.6rem; color: var(--text-muted); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 20px; }
  .wsd-stat-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--border); }
  .wsd-stat-row:last-child { border-bottom: none; }
  .wsd-stat-label { font-family: ${F.b}; font-size: 0.82rem; color: var(--text-muted); }
  .wsd-stat-value { font-family: ${F.h}; font-size: 0.88rem; font-weight: 700; color: var(--text-primary); }
  .wsd-stat-value.amber { color: ${A}; }
  .wsd-stat-value.urgent { color: #F87171; }
  .wsd-stats-cta {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    margin-top: 20px; padding: 12px; border-radius: 10px;
    background: linear-gradient(135deg, #D4A030, #E8B84D);
    color: #1a1a1a; font-family: ${F.h}; font-size: 0.88rem; font-weight: 700;
    text-decoration: none; transition: transform 0.2s, box-shadow 0.2s;
  }
  .wsd-stats-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(232,184,77,0.4); }
  .wsd-stats-cta.free {
    background: rgba(232,184,77,0.1); color: ${A};
    border: 1.5px solid rgba(232,184,77,0.35);
  }
  .wsd-stats-cta.free:hover { background: rgba(232,184,77,0.18); box-shadow: none; }

  /* Content sections */
  .wsd-body { max-width: 760px; margin: 0 auto; padding: 0 32px 80px; }
  .wsd-section { margin-bottom: 64px; }
  .wsd-section-label { font-family: ${F.m}; font-size: 0.65rem; color: ${A}; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 10px; display: flex; align-items: center; gap: 8px; }
  .wsd-section-label::before { content: ''; width: 16px; height: 1.5px; background: ${A}; display: inline-block; }
  .wsd-section-title { font-family: ${F.h}; font-size: 1.3rem; font-weight: 800; color: var(--text-primary); margin-bottom: 20px; letter-spacing: -0.015em; }

  /* Expect list */
  .wsd-expect-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; }
  .wsd-expect-item { display: flex; align-items: flex-start; gap: 10px; font-family: ${F.b}; font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6; }
  .wsd-expect-dot { width: 20px; height: 20px; border-radius: 50%; background: rgba(232,184,77,0.15); border: 1.5px solid rgba(232,184,77,0.4); display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; }

  /* Persona cards */
  .wsd-personas { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
  .wsd-persona-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 20px; }
  .wsd-persona-title { font-family: ${F.h}; font-size: 0.88rem; font-weight: 700; color: ${A}; margin-bottom: 8px; }
  .wsd-persona-desc { font-family: ${F.b}; font-size: 0.82rem; color: var(--text-secondary); line-height: 1.6; }

  /* Sessions timeline */
  .wsd-timeline { display: flex; flex-direction: column; gap: 0; }
  .wsd-session { display: grid; grid-template-columns: 20px 1fr; gap: 16px; padding-bottom: 24px; position: relative; }
  .wsd-session:last-child { padding-bottom: 0; }
  .wsd-session-dot { width: 20px; height: 20px; border-radius: 50%; background: ${A}; flex-shrink: 0; margin-top: 4px; position: relative; z-index: 1; }
  .wsd-session::before { content: ''; position: absolute; left: 9px; top: 24px; bottom: 0; width: 2px; background: rgba(232,184,77,0.2); }
  .wsd-session:last-child::before { display: none; }
  .wsd-session-title { font-family: ${F.h}; font-size: 0.92rem; font-weight: 700; color: var(--text-primary); margin-bottom: 4px; }
  .wsd-session-time { font-family: ${F.m}; font-size: 0.62rem; color: ${A}; letter-spacing: 0.06em; margin-bottom: 6px; }
  .wsd-session-desc { font-family: ${F.b}; font-size: 0.84rem; color: var(--text-secondary); line-height: 1.6; }

  /* Instructor */
  .wsd-instructor { display: flex; align-items: flex-start; gap: 20px; }
  .wsd-instructor-avatar { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, #D4A030, #E8B84D); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .wsd-instructor-name { font-family: ${F.h}; font-size: 1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 2px; }
  .wsd-instructor-role { font-family: ${F.m}; font-size: 0.62rem; color: ${A}; letter-spacing: 0.06em; margin-bottom: 10px; }
  .wsd-instructor-bio { font-family: ${F.b}; font-size: 0.86rem; color: var(--text-secondary); line-height: 1.65; }

  /* FAQ */
  .wsd-faq { display: flex; flex-direction: column; gap: 0; }
  .wsd-faq-item { border-bottom: 1px solid var(--border); }
  .wsd-faq-q {
    width: 100%; text-align: left; background: none; border: none; cursor: pointer;
    padding: 18px 0; display: flex; align-items: center; justify-content: space-between;
    gap: 16px; font-family: ${F.h}; font-size: 0.92rem; font-weight: 700; color: var(--text-primary);
    transition: color 0.2s;
  }
  .wsd-faq-q:hover { color: ${A}; }
  .wsd-faq-q .faq-chev { transition: transform 0.3s; flex-shrink: 0; }
  .wsd-faq-q.open .faq-chev { transform: rotate(180deg); }
  .wsd-faq-a { font-family: ${F.b}; font-size: 0.88rem; color: var(--text-secondary); line-height: 1.7; padding-bottom: 18px; }

  /* Related */
  .wsd-related-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .wsd-rel-card {
    display: grid; grid-template-columns: 72px 1fr; gap: 0;
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 12px; overflow: hidden; text-decoration: none;
    transition: all 0.3s ease;
  }
  .wsd-rel-card:hover { border-color: rgba(232,184,77,0.3); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(232,184,77,0.1); }
  .wsd-rel-badge { background: linear-gradient(180deg, #E8B84D, #D4A030); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 16px 0; }
  .wsd-rel-day { font-family: ${F.h}; font-size: 1.6rem; font-weight: 800; color: #fff; line-height: 1; }
  .wsd-rel-month { font-family: ${F.m}; font-size: 0.58rem; color: rgba(255,255,255,0.85); letter-spacing: 0.08em; margin-top: 2px; }
  .wsd-rel-content { padding: 14px 16px; }
  .wsd-rel-title { font-family: ${F.h}; font-size: 0.84rem; font-weight: 700; color: var(--text-primary); margin-bottom: 4px; }
  .wsd-rel-price { font-family: ${F.h}; font-size: 0.82rem; font-weight: 700; color: ${A}; }

  /* Bottom CTA */
  .wsd-bottom-cta {
    background: var(--bg-2); border-top: 1px solid var(--border);
    padding: 80px 32px; text-align: center;
  }
  .wsd-cta-inner { max-width: 560px; margin: 0 auto; }
  .wsd-cta-title { font-family: ${F.h}; font-size: 1.4rem; font-weight: 800; color: var(--text-primary); margin-bottom: 12px; }
  .wsd-cta-sub { font-family: ${F.b}; font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 28px; line-height: 1.6; }
  .wsd-cta-row { display: flex; align-items: center; justify-content: center; gap: 12px; flex-wrap: wrap; }

  /* Not found */
  .wsd-notfound { min-height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 60px 32px; }

  @media (max-width: 900px) {
    .wsd-hero { grid-template-columns: 1fr; gap: 40px; padding: 100px 32px 60px; }
    .wsd-stats { position: static; }
    .wsd-related-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 600px) {
    .wsd-hero { padding: 100px 20px 60px; }
    .wsd-body { padding: 0 20px 60px; }
    .wsd-personas { grid-template-columns: 1fr; }
    .wsd-instructor { flex-direction: column; }
    .wsd-bottom-cta { padding: 60px 20px; }
  }
`;

// ── Icons ─────────────────────────────────────────────────────────────────────
function IcoArrowLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
  );
}
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
function IcoChevDown({ open }: { open: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`faq-chev${open ? ' open' : ''}`} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
function IcoUser() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  );
}

// ── FAQ Item ──────────────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="wsd-faq-item">
      <button className={`wsd-faq-q${open ? ' open' : ''}`} onClick={() => setOpen((p) => !p)}>
        {q}
        <IcoChevDown open={open} />
      </button>
      {open && (
        <motion.div
          className="wsd-faq-a"
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
export default function WorkshopDetailPage() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : Array.isArray(params.slug) ? params.slug[0] : '';

  const workshop = WORKSHOPS.find((w) => w.slug === slug) as Workshop | undefined;
  const content = WORKSHOP_CONTENT[slug];

  if (!workshop || !content) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="wsd-page">
          <div className="wsd-notfound">
            <h1 style={{ fontFamily: F.h, fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12 }}>Workshop not found</h1>
            <p style={{ fontFamily: F.b, color: 'var(--text-secondary)', marginBottom: 24 }}>This workshop doesn&apos;t exist or has been removed.</p>
            <Link href="/academy/workshops" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 24px', borderRadius: 8, background: `linear-gradient(135deg, #D4A030, ${A})`, color: '#1a1a1a', fontFamily: F.h, fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none' }}>
              <IcoArrowLeft /> All Workshops
            </Link>
          </div>
        </div>
      </>
    );
  }

  const isFree = workshop.price === 0;
  const isPast = workshop.seatsRemaining === 0;
  const urgent = !isPast && workshop.seatsRemaining <= 10;
  const relatedWorkshops = WORKSHOPS.filter((w) => w.slug !== slug && !['ai-dev-q-a-march', 'spec-writing-feb'].includes(w.slug)).slice(0, 2);
  const faqItems = content.faq ?? DEFAULT_FAQ;

  return (
    <>
      <style>{STYLES}</style>
      <main className="wsd-page">

        {/* Hero */}
        <section className="wsd-hero">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Link href="/academy/workshops" className="wsd-back">
              <IcoArrowLeft /> All workshops
            </Link>

            <div className="wsd-date-badge">
              <div className="wsd-date-left">
                <span className="wsd-date-day">{workshop.day}</span>
                <span className="wsd-date-month">{workshop.month}</span>
                <span className="wsd-date-year">{workshop.year}</span>
              </div>
              <div className="wsd-date-right">
                <span className="wsd-date-time">{workshop.time}</span>
                <span className="wsd-date-dur">{workshop.duration}</span>
              </div>
            </div>

            <div className="wsd-format-badge">{workshop.format}</div>
            <h1 className="wsd-title">{workshop.name}</h1>
            <p className="wsd-desc">{workshop.description}</p>

            {!isPast && (
              <Link href="#register" className={`wsd-register-btn${isFree ? ' free' : ''}`}>
                {isFree ? 'Register Free' : `Register — $${workshop.price}`} <IcoArrow />
              </Link>
            )}
            {isPast && (
              <span style={{ fontFamily: F.b, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                This session has passed — recording available below.
              </span>
            )}
          </motion.div>

          {/* Stats sidebar */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="wsd-stats">
              <div className="wsd-stats-title">Session Details</div>
              <div className="wsd-stat-row">
                <span className="wsd-stat-label">Format</span>
                <span className="wsd-stat-value" style={{ textTransform: 'capitalize' }}>{workshop.format}</span>
              </div>
              <div className="wsd-stat-row">
                <span className="wsd-stat-label">Duration</span>
                <span className="wsd-stat-value">{workshop.duration}</span>
              </div>
              <div className="wsd-stat-row">
                <span className="wsd-stat-label">Price</span>
                <span className={`wsd-stat-value amber`}>{isFree ? 'Free' : `$${workshop.price}`}</span>
              </div>
              {!isPast && (
                <div className="wsd-stat-row">
                  <span className="wsd-stat-label">Seats remaining</span>
                  <span className={`wsd-stat-value${urgent ? ' urgent' : ''}`}>
                    {urgent ? `${workshop.seatsRemaining} left!` : `${workshop.seatsRemaining} / ${workshop.maxSeats}`}
                  </span>
                </div>
              )}
              <div className="wsd-stat-row">
                <span className="wsd-stat-label">Next session</span>
                <span className="wsd-stat-value">{workshop.day} {workshop.month} {workshop.year}</span>
              </div>
              {!isPast && (
                <Link id="register" href="#" className={`wsd-stats-cta${isFree ? ' free' : ''}`}>
                  {isFree ? 'Register Free' : `Enroll — $${workshop.price}`} <IcoArrow />
                </Link>
              )}
            </div>
          </motion.div>
        </section>

        {/* Body */}
        <div className="wsd-body">

          {/* What to expect */}
          <motion.div className="wsd-section" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
            <div className="wsd-section-label">What to expect</div>
            <h2 className="wsd-section-title">What happens in this session</h2>
            <ul className="wsd-expect-list">
              {content.expect.map((item, i) => (
                <li key={i} className="wsd-expect-item">
                  <div className="wsd-expect-dot"><IcoCheck /></div>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Who should attend */}
          <motion.div className="wsd-section" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
            <div className="wsd-section-label">Who should attend</div>
            <h2 className="wsd-section-title">This session is for you if</h2>
            <div className="wsd-personas">
              {content.personas.map((p, i) => (
                <div key={i} className="wsd-persona-card">
                  <div className="wsd-persona-title">{p.title}</div>
                  <div className="wsd-persona-desc">{p.desc}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Sessions (sprint only) */}
          {content.sessions && (
            <motion.div className="wsd-section" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
              <div className="wsd-section-label">Schedule</div>
              <h2 className="wsd-section-title">Three sessions over three days</h2>
              <div className="wsd-timeline">
                {content.sessions.map((s, i) => (
                  <div key={i} className="wsd-session">
                    <div className="wsd-session-dot" />
                    <div>
                      <div className="wsd-session-title">{s.title}</div>
                      <div className="wsd-session-time">{s.time}</div>
                      <div className="wsd-session-desc">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Instructor */}
          <motion.div className="wsd-section" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
            <div className="wsd-section-label">Your instructor</div>
            <h2 className="wsd-section-title">Who&apos;s running this session</h2>
            <div className="wsd-instructor">
              <div className="wsd-instructor-avatar"><IcoUser /></div>
              <div>
                <div className="wsd-instructor-name">{content.instructorName}</div>
                <div className="wsd-instructor-role">{content.instructorRole}</div>
                <div className="wsd-instructor-bio">{content.instructorBio}</div>
              </div>
            </div>
          </motion.div>

          {/* FAQ */}
          <motion.div className="wsd-section" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
            <div className="wsd-section-label">Common questions</div>
            <h2 className="wsd-section-title">Before you register</h2>
            <div className="wsd-faq">
              {faqItems.map((item, i) => (
                <FaqItem key={i} q={item.q} a={item.a} />
              ))}
            </div>
          </motion.div>

          {/* Related */}
          {relatedWorkshops.length > 0 && (
            <motion.div className="wsd-section" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
              <div className="wsd-section-label">Other sessions</div>
              <h2 className="wsd-section-title">You might also like</h2>
              <div className="wsd-related-grid">
                {relatedWorkshops.map((r) => (
                  <Link key={r.slug} href={`/academy/workshops/${r.slug}`} className="wsd-rel-card">
                    <div className="wsd-rel-badge">
                      <span className="wsd-rel-day">{r.day}</span>
                      <span className="wsd-rel-month">{r.month}</span>
                    </div>
                    <div className="wsd-rel-content">
                      <div className="wsd-rel-title">{r.name}</div>
                      <div className="wsd-rel-price">{r.price === 0 ? 'Free' : `$${r.price}`}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

        </div>

        {/* Bottom CTA */}
        {!isPast && (
          <section className="wsd-bottom-cta">
            <div className="wsd-cta-inner">
              <motion.h2 className="wsd-cta-title" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
                Reserve your seat.
              </motion.h2>
              <motion.p className="wsd-cta-sub" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.08 }}>
                {urgent
                  ? `Only ${workshop.seatsRemaining} seats remaining. Recording sent to all registered participants within 24 hours if you can&apos;t make it live.`
                  : 'Recording sent to all registered participants within 24 hours if you can\'t make it live.'}
              </motion.p>
              <motion.div className="wsd-cta-row" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.14 }}>
                <Link href="#register" className={`wsd-register-btn${isFree ? ' free' : ''}`}>
                  {isFree ? 'Register Free' : `Register — $${workshop.price}`} <IcoArrow />
                </Link>
                <Link href="/academy/workshops" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '14px 24px', borderRadius: 10, border: '1.5px solid var(--border)', fontFamily: F.b, fontSize: '0.88rem', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'border-color 0.2s, color 0.2s' }}>
                  All workshops
                </Link>
              </motion.div>
            </div>
          </section>
        )}

      </main>
    </>
  );
}
