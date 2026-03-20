'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const A = '#72C4B2';
const F = {
  h: "var(--font-manrope,'Manrope'),sans-serif",
  b: "var(--font-dm-sans,'DM Sans'),sans-serif",
  m: "var(--font-jb-mono,'JetBrains Mono'),monospace",
};
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const STYLES = `
  .proc-page { background: var(--bg); min-height: 100vh; }

  .proc-hero {
    padding: clamp(100px,12vw,160px) 32px clamp(60px,8vw,100px);
    max-width: 1200px;
    margin: 0 auto;
  }

  .sec-label {
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
  .sec-label::before {
    content: '';
    width: 20px;
    height: 1.5px;
    background: ${A};
    display: inline-block;
    flex-shrink: 0;
  }

  .proc-hero-title {
    font-family: ${F.h};
    font-size: clamp(2.2rem,4.5vw,3.2rem);
    font-weight: 800;
    color: var(--text-primary);
    letter-spacing: -0.03em;
    line-height: 1.08;
    margin: 0 0 20px;
    max-width: 820px;
  }

  .proc-hero-sub {
    font-family: ${F.b};
    font-size: 1.05rem;
    color: var(--text-secondary);
    line-height: 1.75;
    margin: 0;
    max-width: 600px;
  }

  /* Timeline */
  .proc-timeline {
    max-width: 1200px;
    margin: 0 auto;
    padding: 80px 32px;
  }

  .proc-timeline-heading {
    margin-bottom: 64px;
  }

  .proc-steps {
    display: flex;
    flex-direction: column;
    gap: 0;
    position: relative;
  }
  .proc-steps::before {
    content: '';
    position: absolute;
    left: 28px;
    top: 56px;
    bottom: 56px;
    width: 1.5px;
    background: linear-gradient(to bottom, ${A}44, ${A}22, ${A}00);
  }

  .proc-step {
    display: grid;
    grid-template-columns: 56px 1fr;
    gap: 32px;
    padding: 40px 0;
    border-bottom: 1px solid var(--border);
  }
  .proc-step:last-child { border-bottom: none; }

  .proc-step-num-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 4px;
    position: relative;
    z-index: 1;
  }
  .proc-step-num {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: var(--bg-card);
    border: 1.5px solid ${A}44;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: ${F.m};
    font-size: 0.85rem;
    font-weight: 600;
    color: ${A};
    flex-shrink: 0;
  }

  .proc-step-content { padding: 8px 0 24px; }

  .proc-step-day {
    font-family: ${F.m};
    font-size: 0.7rem;
    font-weight: 500;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 8px;
  }

  .proc-step-title {
    font-family: ${F.h};
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.02em;
    margin: 0 0 8px;
  }

  .proc-step-tagline {
    font-family: ${F.b};
    font-size: 0.9rem;
    color: ${A};
    margin: 0 0 16px;
    font-style: italic;
  }

  .proc-step-body {
    font-family: ${F.b};
    font-size: 0.95rem;
    color: var(--text-secondary);
    line-height: 1.7;
    margin: 0 0 16px;
  }

  .proc-step-get {
    background: var(--bg-2);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px 20px;
    margin-top: 16px;
  }
  .proc-step-get-label {
    font-family: ${F.m};
    font-size: 0.68rem;
    font-weight: 500;
    color: ${A};
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 8px;
  }
  .proc-step-get-text {
    font-family: ${F.b};
    font-size: 0.88rem;
    color: var(--text-secondary);
    line-height: 1.6;
    margin: 0;
  }

  .proc-step-quote {
    background: ${A}08;
    border: 1px solid ${A}22;
    border-left: 3px solid ${A};
    border-radius: 0 12px 12px 0;
    padding: 16px 20px;
    margin-top: 16px;
  }
  .proc-step-quote-text {
    font-family: ${F.b};
    font-size: 0.88rem;
    color: var(--text-primary);
    line-height: 1.6;
    font-style: italic;
    margin: 0 0 8px;
  }
  .proc-step-quote-attr {
    font-family: ${F.m};
    font-size: 0.68rem;
    color: ${A};
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .proc-step-cols {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-top: 16px;
  }
  .proc-step-path {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px 18px;
  }
  .proc-step-path-label {
    font-family: ${F.m};
    font-size: 0.68rem;
    color: ${A};
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 6px;
  }
  .proc-step-path-text {
    font-family: ${F.b};
    font-size: 0.84rem;
    color: var(--text-secondary);
    line-height: 1.55;
    margin: 0;
  }

  /* Timeline comparison */
  .proc-timelines {
    background: var(--bg-2);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    padding: 80px 32px;
  }
  .proc-timelines-inner { max-width: 1200px; margin: 0 auto; }
  .proc-timelines-title {
    font-family: ${F.h};
    font-size: clamp(1.5rem,2.5vw,2rem);
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.02em;
    margin: 0 0 8px;
  }
  .proc-timelines-sub {
    font-family: ${F.b};
    font-size: 0.9rem;
    color: var(--text-muted);
    margin: 0 0 40px;
  }
  .proc-timeline-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }
  .proc-timeline-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 24px;
  }
  .proc-timeline-card-type {
    font-family: ${F.m};
    font-size: 0.68rem;
    color: ${A};
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 8px;
  }
  .proc-timeline-card-time {
    font-family: ${F.h};
    font-size: 1.6rem;
    font-weight: 800;
    color: var(--text-primary);
    letter-spacing: -0.02em;
    margin-bottom: 4px;
  }
  .proc-timeline-card-note {
    font-family: ${F.b};
    font-size: 0.78rem;
    color: var(--text-muted);
    line-height: 1.4;
  }
  .proc-timelines-compare {
    margin-top: 24px;
    font-family: ${F.b};
    font-size: 0.84rem;
    color: var(--text-muted);
    text-align: center;
    padding: 16px;
    background: var(--bg);
    border-radius: 12px;
    border: 1px solid var(--border);
  }
  .proc-timelines-compare strong {
    color: var(--text-secondary);
    font-weight: 600;
  }

  /* AI vs Human split */
  .proc-split {
    max-width: 1200px;
    margin: 0 auto;
    padding: 80px 32px;
  }
  .proc-split-banner {
    background: ${A}10;
    border: 1px solid ${A}30;
    border-radius: 16px;
    padding: 24px 32px;
    margin-bottom: 48px;
    text-align: center;
  }
  .proc-split-banner-text {
    font-family: ${F.b};
    font-size: 1rem;
    color: var(--text-primary);
    line-height: 1.65;
    margin: 0;
  }
  .proc-split-banner-text strong {
    color: ${A};
    font-weight: 600;
  }
  .proc-split-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }
  .proc-split-col { }
  .proc-split-col-title {
    font-family: ${F.h};
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 20px;
    letter-spacing: -0.01em;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border);
  }
  .proc-split-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 16px;
  }
  .proc-split-item:last-child { margin-bottom: 0; }
  .proc-split-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${A};
    margin-top: 7px;
    flex-shrink: 0;
  }
  .proc-split-item-text {
    font-family: ${F.b};
    font-size: 0.9rem;
    color: var(--text-secondary);
    line-height: 1.55;
    flex: 1;
  }
  .proc-split-item-save {
    font-family: ${F.m};
    font-size: 0.68rem;
    color: ${A};
    letter-spacing: 0.06em;
    background: ${A}15;
    border-radius: 100px;
    padding: 2px 8px;
    white-space: nowrap;
    flex-shrink: 0;
  }

  /* CTA */
  .proc-cta {
    background: var(--bg-2);
    border-top: 1px solid var(--border);
    padding: 100px 32px;
    text-align: center;
  }
  .proc-cta-inner { max-width: 600px; margin: 0 auto; }
  .proc-cta-title {
    font-family: ${F.h};
    font-size: clamp(1.8rem,3vw,2.4rem);
    font-weight: 800;
    color: var(--text-primary);
    letter-spacing: -0.02em;
    margin: 0 0 16px;
  }
  .proc-cta-sub {
    font-family: ${F.b};
    font-size: 1rem;
    color: var(--text-secondary);
    margin: 0 0 40px;
    line-height: 1.7;
  }
  .proc-cta-btns {
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

  @media (max-width: 900px) {
    .proc-split-grid { grid-template-columns: 1fr; }
    .proc-timeline-cards { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 768px) {
    .proc-hero { padding: 100px 20px 60px; }
    .proc-timeline { padding: 60px 20px; }
    .proc-split { padding: 60px 20px; }
    .proc-step { grid-template-columns: 48px 1fr; gap: 20px; }
    .proc-steps::before { left: 23px; }
    .proc-step-cols { grid-template-columns: 1fr; }
    .proc-timeline-cards { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 480px) {
    .proc-timeline-cards { grid-template-columns: 1fr; }
  }
`;

type Step = {
  num: string;
  day: string;
  title: string;
  tagline: string;
  body: string;
  get?: string;
  quote?: { text: string; attr: string };
  paths?: [string, string];
};

const STEPS: Step[] = [
  {
    num: '01',
    day: 'Day 0',
    title: 'Discovery Call',
    tagline: '"You tell us what you need. We listen."',
    body: '30 minutes. No technical terms required. We ask three things: What problem are you solving? Who uses it? What does success look like? You don\'t need to have answers for everything — that\'s what the call is for.',
    get: 'Honest assessment on the call — timeline, cost range, and whether we\'re a good fit. If we\'re not the right team for your project, we\'ll tell you.',
  },
  {
    num: '02',
    day: 'Days 1–3',
    title: 'Scoping & Proposal',
    tagline: '"We design the plan. You approve it."',
    body: 'Our engineers design the architecture based on what we learned on the call. We write a plain-English proposal — no jargon, no ambiguity. Every feature listed. Every dependency documented.',
    get: 'A written proposal with exactly what we\'re building, exactly how long it will take, and exactly what it costs. You approve before we write a single line of code.',
  },
  {
    num: '03',
    day: 'Days 3–5',
    title: 'Architecture & Setup',
    tagline: '"We set up the foundation right."',
    body: 'Repository, architecture, database design, development environment, and deployment pipeline. Before any feature code is written, the infrastructure is solid. Most projects that fail in production failed here.',
    get: 'Technology selection, database schema design, API structure, authentication strategy, and hosting setup — all documented and shared with you.',
  },
  {
    num: '04',
    day: 'Days 5 onwards',
    title: 'AI-Powered Build',
    tagline: '"AI builds fast. Engineers verify everything."',
    body: 'AI generates the initial codebase, tests, and documentation. Engineers review every file, fix issues, and write the complex logic that requires genuine judgment. On average, AI generates about 70% of the code — engineers spend their time on the 30% that determines whether the product works in production.',
    get: 'Weekly progress updates in plain English. Live demo sessions so you can see what\'s been built. A shared channel for questions and feedback.',
    quote: {
      text: '"The build phase is where you feel the speed difference. What a traditional agency does in Sprint 3, we\'re doing in Week 1."',
      attr: 'Kamrul Hasan — CTO, SocioFi Technology',
    },
  },
  {
    num: '05',
    day: 'Pre-launch',
    title: 'Testing & QA',
    tagline: '"We break it on purpose so your customers don\'t."',
    body: 'Automated test suites run on every code change. Manual testing covers every user flow. We test across browsers and devices, run a security scan for common vulnerabilities, and performance-test under realistic load.',
    get: 'A product that works everywhere — not just on your engineer\'s laptop.',
  },
  {
    num: '06',
    day: 'Launch',
    title: 'Review & Launch',
    tagline: '"You test it. We ship it."',
    body: 'You get hands-on time with the finished product. A structured review period where you test every flow and raise anything that needs adjusting. We fix what you find. Then we deploy to production — your real domain, with SSL, DNS, and monitoring active.',
    get: 'A live product your customers can use immediately. Everything deployed, monitored, and working.',
  },
  {
    num: '07',
    day: 'Post-launch',
    title: 'Handoff & Ongoing',
    tagline: '"Your product is live. Now what?"',
    body: 'We hand you everything: the codebase (100% yours from day one), full documentation, all credentials and access. You are never locked in. Two paths from here:',
    paths: [
      'Take the code and go — no lock-in, no ongoing obligation.',
      'Move to a Services maintenance plan — same team, same codebase, ongoing support.',
    ],
  },
];

const TIMELINES = [
  { type: 'Simple MVP', time: '2–3 wks', note: 'From first call to live product' },
  { type: 'Standard Product', time: '4–6 wks', note: 'Full-stack application, all features' },
  { type: 'Complex System', time: '6–12 wks', note: 'Multi-module, integrations, scale' },
  { type: 'Rescue Project', time: '1–3 wks', note: 'Fix existing code and deploy' },
];

const AI_HANDLES = [
  { task: 'Code generation', save: 'saves ~60%' },
  { task: 'Automated testing', save: 'saves ~40%' },
  { task: 'Documentation', save: 'saves ~80%' },
  { task: 'Boilerplate and scaffolding', save: 'saves ~90%' },
  { task: 'Data transformations', save: 'saves ~70%' },
];

const HUMAN_HANDLES = [
  { task: 'Architecture design — judgment can\'t be automated', save: '' },
  { task: 'Code review — catches 15–20% of AI issues before they ship', save: '' },
  { task: 'Security review — requires threat modeling and context', save: '' },
  { task: 'Deployment and infrastructure — requires operational knowledge', save: '' },
  { task: 'Client communication — plain English throughout', save: '' },
];

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 7h10M7 2l5 5-5 5" />
    </svg>
  );
}

const inview = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 as const },
  transition: { duration: 0.7, ease: EASE },
};

export default function ProcessPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="proc-page">

        {/* Hero */}
        <section className="proc-hero">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <p className="sec-label">How We Build</p>
            <h1 className="proc-hero-title">Here's Exactly What Happens When You Work With Us.</h1>
            <p className="proc-hero-sub">No mysteries. No "we'll figure it out as we go." Every step is planned, every cost is agreed, every update is in plain English.</p>
          </motion.div>
        </section>

        {/* 7-Step Timeline */}
        <div className="proc-timeline">
          <motion.div className="proc-timeline-heading" {...inview}>
            <p className="sec-label">The process</p>
            <h2 style={{ fontFamily: F.h, fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
              Seven steps from first call to live product
            </h2>
          </motion.div>

          <div className="proc-steps">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                className="proc-step"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6, ease: EASE, delay: i * 0.05 }}
              >
                <div className="proc-step-num-wrap">
                  <div className="proc-step-num">{step.num}</div>
                </div>
                <div className="proc-step-content">
                  <p className="proc-step-day">{step.day}{step.num === '01' ? ' · Free' : step.num === '02' ? ' · Free' : ''}</p>
                  <h3 className="proc-step-title">{step.title}</h3>
                  <p className="proc-step-tagline">{step.tagline}</p>
                  <p className="proc-step-body">{step.body}</p>
                  {step.paths && (
                    <div className="proc-step-cols">
                      {step.paths.map((p, pi) => (
                        <div key={pi} className="proc-step-path">
                          <p className="proc-step-path-label">Path {pi + 1}</p>
                          <p className="proc-step-path-text">
                            {pi === 1
                              ? <><span>{p.replace('→ /services/plans', '')}</span><Link href="/services/plans" style={{ color: A, textDecoration: 'none', marginLeft: 4 }}>See plans</Link></>
                              : p
                            }
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  {step.get && (
                    <div className="proc-step-get">
                      <p className="proc-step-get-label">What you get</p>
                      <p className="proc-step-get-text">{step.get}</p>
                    </div>
                  )}
                  {step.quote && (
                    <div className="proc-step-quote">
                      <p className="proc-step-quote-text">{step.quote.text}</p>
                      <p className="proc-step-quote-attr">{step.quote.attr}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Timeline comparison */}
        <section className="proc-timelines">
          <div className="proc-timelines-inner">
            <motion.div {...inview}>
              <p className="sec-label">Timelines</p>
              <h2 className="proc-timelines-title">How long does it actually take?</h2>
              <p className="proc-timelines-sub">From your first call to a live product in your hands.</p>
              <div className="proc-timeline-cards">
                {TIMELINES.map((t) => (
                  <div key={t.type} className="proc-timeline-card">
                    <p className="proc-timeline-card-type">{t.type}</p>
                    <p className="proc-timeline-card-time">{t.time}</p>
                    <p className="proc-timeline-card-note">{t.note}</p>
                  </div>
                ))}
              </div>
              <p className="proc-timelines-compare">
                <strong>Traditional agency comparison:</strong> multiply these timelines by 3x–6x.
              </p>
            </motion.div>
          </div>
        </section>

        {/* AI vs Human */}
        <section className="proc-split">
          <motion.div {...inview}>
            <p className="sec-label">How we use AI</p>
            <h2 style={{ fontFamily: F.h, fontSize: 'clamp(1.5rem,2.5vw,2rem)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: '0 0 32px' }}>
              AI and human engineers: what each one does
            </h2>
            <div className="proc-split-banner">
              <p className="proc-split-banner-text">
                <strong>AI generates approximately 70% of the initial code.</strong> Engineers spend their time on the 30% that makes the difference between a demo and a product.
              </p>
            </div>
            <div className="proc-split-grid">
              <div className="proc-split-col">
                <h3 className="proc-split-col-title">AI handles</h3>
                {AI_HANDLES.map((item) => (
                  <div key={item.task} className="proc-split-item">
                    <div className="proc-split-dot" />
                    <span className="proc-split-item-text">{item.task}</span>
                    {item.save && <span className="proc-split-item-save">{item.save}</span>}
                  </div>
                ))}
              </div>
              <div className="proc-split-col">
                <h3 className="proc-split-col-title">Engineers handle</h3>
                {HUMAN_HANDLES.map((item) => (
                  <div key={item.task} className="proc-split-item">
                    <div className="proc-split-dot" />
                    <span className="proc-split-item-text">{item.task}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* CTA */}
        <section className="proc-cta">
          <div className="proc-cta-inner">
            <motion.div {...inview}>
              <p className="sec-label" style={{ justifyContent: 'center' }}>Ready to start</p>
              <h2 className="proc-cta-title">Seen enough? Let's build.</h2>
              <p className="proc-cta-sub">You know the process. Now let's apply it to your project.</p>
              <div className="proc-cta-btns">
                <Link href="/studio/start-project" className="btn-primary">
                  Start Your Project
                  <ArrowIcon />
                </Link>
                <Link href="/studio/pricing" className="btn-ghost">
                  See Pricing
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

      </div>
    </>
  );
}
