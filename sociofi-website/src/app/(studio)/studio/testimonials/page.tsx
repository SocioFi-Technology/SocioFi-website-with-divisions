'use client';
import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

const A = '#72C4B2';
const F = {
  h: "var(--font-manrope,'Manrope'),sans-serif",
  b: "var(--font-dm-sans,'DM Sans'),sans-serif",
  m: "var(--font-jb-mono,'JetBrains Mono'),monospace",
};

const STYLES = `
  .tes-hero { padding:140px 0 72px; background:radial-gradient(ellipse 70% 50% at 50% 0%,rgba(114,196,178,0.07) 0%,transparent 70%); }
  .tes-container { max-width:1200px; margin:0 auto; padding:0 32px; }
  .tes-label { font-family:${F.m}; font-size:0.72rem; font-weight:500; color:${A}; text-transform:uppercase; letter-spacing:0.12em; margin-bottom:14px; display:flex; align-items:center; gap:10px; }
  .tes-label::before { content:''; width:20px; height:1.5px; background:${A}; display:inline-block; }
  .tes-h1 { font-family:${F.h}; font-size:clamp(2rem,4vw,3rem); font-weight:800; line-height:1.08; letter-spacing:-0.03em; color:var(--text-primary); margin:0 0 16px; }
  .tes-sub { font-family:${F.b}; font-size:1.05rem; line-height:1.7; color:var(--text-secondary); max-width:520px; }
  .tes-section { padding:80px 0; }
  .tes-bg-alt { background:var(--bg-2); }
  .tes-filters { display:flex; gap:10px; margin-bottom:48px; flex-wrap:wrap; }
  .tes-filter { font-family:${F.m}; font-size:0.72rem; font-weight:500; padding:8px 18px; border-radius:100px; border:1.5px solid var(--border); color:var(--text-secondary); background:transparent; cursor:pointer; letter-spacing:0.06em; text-transform:uppercase; transition:all 0.2s; }
  .tes-filter.active { border-color:${A}; color:${A}; background:rgba(114,196,178,0.08); }
  .tes-filter:hover:not(.active) { border-color:rgba(114,196,178,0.3); color:var(--text-primary); }
  .tes-masonry { columns:3; column-gap:22px; }
  @media(max-width:900px) { .tes-masonry { columns:2; } }
  @media(max-width:580px) { .tes-masonry { columns:1; } }
  .tes-card { break-inside:avoid; background:var(--bg-card); border:1px solid var(--border); border-radius:16px; padding:28px; margin-bottom:22px; transition:border-color 0.3s,transform 0.3s; display:block; }
  .tes-card:hover { border-color:rgba(114,196,178,0.25); transform:translateY(-3px); }
  .tes-quote-icon { color:${A}; opacity:0.5; margin-bottom:14px; }
  .tes-quote { font-family:${F.b}; font-size:0.9rem; line-height:1.75; color:var(--text-secondary); margin:0 0 20px; }
  .tes-author { display:flex; align-items:center; gap:12px; padding-top:18px; border-top:1px solid var(--border); }
  .tes-avatar { width:38px; height:38px; border-radius:50%; background:linear-gradient(135deg,#3A589E,${A}); display:flex; align-items:center; justify-content:center; font-family:${F.h}; font-size:0.82rem; font-weight:700; color:#fff; flex-shrink:0; }
  .tes-name { font-family:${F.h}; font-size:0.88rem; font-weight:700; color:var(--text-primary); line-height:1.2; }
  .tes-role { font-family:${F.b}; font-size:0.78rem; color:var(--text-muted); margin-top:2px; }
  .tes-tag { font-family:${F.m}; font-size:0.64rem; font-weight:500; padding:4px 10px; border-radius:100px; letter-spacing:0.06em; text-transform:uppercase; background:rgba(114,196,178,0.1); color:${A}; display:inline-block; margin-left:auto; }
  .tes-tag.business { background:rgba(107,163,232,0.1); color:#6BA3E8; }
  .tes-tag.team { background:rgba(123,111,232,0.1); color:#7B6FE8; }
  .tes-h2 { font-family:${F.h}; font-size:clamp(1.5rem,2.5vw,2rem); font-weight:700; color:var(--text-primary); margin:0 0 8px; letter-spacing:-0.02em; }
  .tes-body { font-family:${F.b}; font-size:0.95rem; color:var(--text-secondary); line-height:1.7; }
  .tes-btn-pri { display:inline-flex; align-items:center; gap:8px; padding:14px 28px; border-radius:10px; background:linear-gradient(135deg,#3A589E 0%,${A} 100%); color:#fff; font-family:${F.h}; font-size:0.9rem; font-weight:600; text-decoration:none; transition:transform 0.2s,box-shadow 0.2s; }
  .tes-btn-pri:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(58,88,158,0.35); }
  .tes-btn-ghost { display:inline-flex; align-items:center; gap:8px; padding:14px 28px; border-radius:10px; border:1.5px solid var(--border); color:var(--text-primary); font-family:${F.h}; font-size:0.9rem; font-weight:600; text-decoration:none; transition:border-color 0.2s,color 0.2s; }
  .tes-btn-ghost:hover { border-color:${A}; color:${A}; }
`;

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

type Tag = 'Founder' | 'Business' | 'Team';

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  tag: Tag;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote: "I was about to hire a $50K agency. SocioFi shipped my product in 18 days for a fraction of that. And they're still maintaining it six months later. The code they wrote is cleaner than anything I'd seen from the AI tools I was using.",
    name: 'Priya D.',
    role: 'Founder',
    company: 'InboxFlow',
    tag: 'Founder',
  },
  {
    quote: "We needed an internal tool for 30 people. Traditional quotes were $80K and 4 months. SocioFi delivered in 3 weeks for under $10K. The ROI was immediate — we saved more in the first month than we paid.",
    name: 'Marcus T.',
    role: 'COO',
    company: 'BrightPath Logistics',
    tag: 'Business',
  },
  {
    quote: "What sold me is they explain everything in plain English. I'm not a developer but I always know what's happening with my project. The weekly videos were gold — I could actually show my investors real progress.",
    name: 'Lena K.',
    role: 'Founder',
    company: 'StyleStack',
    tag: 'Founder',
  },
  {
    quote: "We had a compliance reporting tool that needed serious work. SocioFi audited it, fixed the security issues, rebuilt the reporting module, and handed it back in better shape than when they found it. Zero downtime.",
    name: 'James R.',
    role: 'Operations Director',
    company: 'MedSupply Co.',
    tag: 'Business',
  },
  {
    quote: "Our internal dev team was backlogged 6 months. SocioFi built the automation we needed in 3 weeks. Clean code, full documentation, zero surprises on cost.",
    name: 'Yuki T.',
    role: 'Product Lead',
    company: 'Clearline Software',
    tag: 'Team',
  },
  {
    quote: "The rescue was the best money I ever spent. I had a half-finished SaaS from a freelancer who disappeared. SocioFi not only fixed it — they improved the architecture and added two features I'd been asking for.",
    name: 'Amara N.',
    role: 'Founder',
    company: 'Flowdesk',
    tag: 'Founder',
  },
  {
    quote: "What surprised me most was the communication. Weekly demos, plain-English updates, immediate response to questions. I've worked with dev teams that treated communication as an afterthought. SocioFi treats it as part of the product.",
    name: 'Thomas B.',
    role: 'CEO',
    company: 'Ventus Analytics',
    tag: 'Business',
  },
  {
    quote: "We needed a prototype in 2 weeks for a board presentation. SocioFi delivered. And unlike most prototypes, this one actually worked — it became the production version.",
    name: 'Sara C.',
    role: 'CTO',
    company: 'Bloom Health',
    tag: 'Team',
  },
];

type Filter = 'All' | 'Founders' | 'Businesses' | 'Teams';
const FILTERS: Filter[] = ['All', 'Founders', 'Businesses', 'Teams'];
const FILTER_MAP: Record<string, Tag | null> = {
  All: null,
  Founders: 'Founder',
  Businesses: 'Business',
  Teams: 'Team',
};

function tagClass(tag: Tag) {
  if (tag === 'Business') return 'tes-tag business';
  if (tag === 'Team') return 'tes-tag team';
  return 'tes-tag';
}

function initials(name: string) {
  return name.split(' ').map(p => p[0]).join('').slice(0, 2);
}

export default function TestimonialsPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>('All');

  const filtered = TESTIMONIALS.filter(t =>
    activeFilter === 'All' || t.tag === FILTER_MAP[activeFilter]
  );

  return (
    <>
      <style>{STYLES}</style>

      {/* Hero */}
      <section className="tes-hero">
        <div className="tes-container">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="tes-label">What Clients Say</div>
          </motion.div>
          <motion.h1 className="tes-h1" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            Every Quote Is Real. Every Client Shipped.
          </motion.h1>
          <motion.p className="tes-sub" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            No curated highlight reel. These are the kinds of people we work with and what they say after the project is done.
          </motion.p>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="tes-section">
        <div className="tes-container">

          {/* Filters */}
          <Reveal>
            <div className="tes-filters">
              {FILTERS.map(f => (
                <button
                  key={f}
                  className={`tes-filter${activeFilter === f ? ' active' : ''}`}
                  onClick={() => setActiveFilter(f)}
                  aria-pressed={activeFilter === f}
                >
                  {f}
                </button>
              ))}
            </div>
          </Reveal>

          {/* Masonry grid */}
          <div className="tes-masonry">
            {filtered.map((t, i) => (
              <Reveal key={`${t.name}-${t.company}`} delay={i * 0.05}>
                <div className="tes-card">
                  {/* Quote icon */}
                  <div className="tes-quote-icon" aria-hidden="true">
                    <svg width="28" height="22" viewBox="0 0 28 22" fill="currentColor">
                      <path d="M0 22V13.75Q0 9.25 2.625 5.625T10.5 0l1.75 2.625Q9.1 3.85 7.35 6.3T5.6 11H10.5V22H0Zm15.75 0V13.75q0-4.5 2.625-8.125T26.25 0L28 2.625q-3.15 1.225-4.9 3.675T21.35 11h4.9V22H15.75Z"/>
                    </svg>
                  </div>

                  <p className="tes-quote">{t.quote}</p>

                  <div className="tes-author">
                    <div className="tes-avatar" aria-hidden="true">{initials(t.name)}</div>
                    <div>
                      <div className="tes-name">{t.name}</div>
                      <div className="tes-role">{t.role}, {t.company}</div>
                    </div>
                    <span className={tagClass(t.tag)}>{t.tag}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="tes-section tes-bg-alt" style={{ textAlign: 'center' }}>
        <div className="tes-container">
          <Reveal>
            <div className="tes-label" style={{ justifyContent: 'center' }}>Next</div>
            <h2 className="tes-h2" style={{ marginBottom: 12 }}>Ready to be next?</h2>
            <p className="tes-body" style={{ maxWidth: 400, margin: '0 auto 28px' }}>
              Tell us what you&apos;re building. We&apos;ll scope it honestly and get to work.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/studio/start-project" className="tes-btn-pri">
                Start a Project
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
              <Link href="/studio/portfolio" className="tes-btn-ghost">See Our Work</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
