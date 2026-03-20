'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const A = '#72C4B2';
const F = {
  h: "var(--font-manrope,'Manrope'),sans-serif",
  b: "var(--font-dm-sans,'DM Sans'),sans-serif",
  m: "var(--font-jb-mono,'JetBrains Mono'),monospace",
};
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const STYLES = `
  .port-page { background: var(--bg); min-height: 100vh; }

  .port-hero {
    padding: clamp(100px,12vw,160px) 32px clamp(60px,8vw,100px);
    max-width: 1200px;
    margin: 0 auto;
  }

  .port-label {
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
  .port-label::before {
    content: '';
    width: 20px;
    height: 1.5px;
    background: ${A};
    display: inline-block;
    flex-shrink: 0;
  }

  .port-hero-title {
    font-family: ${F.h};
    font-size: clamp(2.2rem,4.5vw,3.4rem);
    font-weight: 800;
    color: var(--text-primary);
    letter-spacing: -0.03em;
    line-height: 1.08;
    margin: 0 0 20px;
    max-width: 820px;
  }

  .port-hero-sub {
    font-family: ${F.b};
    font-size: 1.1rem;
    color: var(--text-secondary);
    line-height: 1.7;
    margin: 0;
    max-width: 560px;
  }

  /* Metrics bar */
  .port-metrics {
    background: var(--bg-2);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }
  .port-metrics-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 32px;
    display: flex;
    align-items: center;
    gap: 0;
  }
  .port-metric {
    flex: 1;
    padding: 28px 32px;
    border-right: 1px solid var(--border);
    text-align: center;
  }
  .port-metric:last-child { border-right: none; }
  .port-metric-val {
    font-family: ${F.h};
    font-size: 1.8rem;
    font-weight: 800;
    color: ${A};
    letter-spacing: -0.02em;
    display: block;
    margin-bottom: 4px;
  }
  .port-metric-lab {
    font-family: ${F.b};
    font-size: 0.84rem;
    color: var(--text-muted);
  }

  /* Filter bar */
  .port-filter-wrap {
    position: sticky;
    top: 72px;
    z-index: 40;
    background: var(--bg);
    border-bottom: 1px solid var(--border);
  }
  .port-filter {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 32px;
    display: flex;
    align-items: center;
    gap: 8px;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .port-filter::-webkit-scrollbar { display: none; }
  .port-filter-tab {
    font-family: ${F.m};
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 14px 18px;
    border: none;
    background: transparent;
    color: var(--text-muted);
    cursor: pointer;
    white-space: nowrap;
    position: relative;
    transition: color 0.2s;
    flex-shrink: 0;
  }
  .port-filter-tab:hover { color: var(--text-primary); }
  .port-filter-tab.active { color: ${A}; }
  .port-filter-tab.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${A};
  }

  /* Bento grid */
  .port-grid-wrap {
    max-width: 1200px;
    margin: 0 auto;
    padding: 60px 32px;
  }
  .port-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  /* Cards */
  .port-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 32px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: border-color 0.3s, transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s;
    text-decoration: none;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .port-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, #3A589E, ${A});
    opacity: 0;
    transition: opacity 0.3s;
  }
  .port-card:hover {
    border-color: var(--border-hover);
    transform: translateY(-6px);
    box-shadow: 0 20px 60px rgba(0,0,0,0.22);
  }
  .port-card:hover::before { opacity: 1; }
  .port-card.featured { grid-column: span 2; }

  .port-card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }
  .port-card-badges {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  .port-badge {
    font-family: ${F.m};
    font-size: 0.65rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 100px;
    border: 1px solid;
  }
  .port-badge-cat {
    color: ${A};
    border-color: ${A}44;
    background: ${A}11;
  }
  .port-badge-featured {
    color: #E8B84D;
    border-color: #E8B84D44;
    background: #E8B84D11;
  }
  .port-badge-product {
    color: #7B6FE8;
    border-color: #7B6FE844;
    background: #7B6FE811;
  }

  .port-arrow {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: border-color 0.2s, background 0.2s;
  }
  .port-card:hover .port-arrow {
    border-color: ${A};
    background: ${A}15;
  }

  .port-card-name {
    font-family: ${F.h};
    font-size: 1.4rem;
    font-weight: 800;
    color: var(--text-primary);
    letter-spacing: -0.02em;
    margin: 0;
    line-height: 1.2;
  }
  .port-card.featured .port-card-name { font-size: 1.7rem; }

  .port-card-client {
    font-family: ${F.b};
    font-size: 0.84rem;
    color: var(--text-muted);
    margin: 0;
  }

  .port-card-problem {
    font-family: ${F.b};
    font-size: 0.9rem;
    color: var(--text-secondary);
    line-height: 1.65;
    margin: 0;
  }

  .port-card-metrics {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
    margin-top: auto;
    padding-top: 16px;
    border-top: 1px solid var(--border);
  }
  .port-card-metric {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .port-card-metric-val {
    font-family: ${F.m};
    font-size: 0.85rem;
    font-weight: 600;
    color: ${A};
  }
  .port-card-metric-lab {
    font-family: ${F.b};
    font-size: 0.72rem;
    color: var(--text-muted);
  }

  .port-card-desc {
    font-family: ${F.b};
    font-size: 0.9rem;
    color: var(--text-secondary);
    line-height: 1.65;
    margin: 0;
  }

  /* CTA section */
  .port-cta {
    background: var(--bg-2);
    border-top: 1px solid var(--border);
    padding: 100px 32px;
    text-align: center;
  }
  .port-cta-inner { max-width: 600px; margin: 0 auto; }
  .port-cta-title {
    font-family: ${F.h};
    font-size: clamp(1.8rem,3vw,2.4rem);
    font-weight: 800;
    color: var(--text-primary);
    letter-spacing: -0.02em;
    margin: 0 0 16px;
  }
  .port-cta-sub {
    font-family: ${F.b};
    font-size: 1rem;
    color: var(--text-secondary);
    margin: 0 0 40px;
    line-height: 1.7;
  }
  .port-cta-btns {
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

  @media (max-width: 768px) {
    .port-grid { grid-template-columns: 1fr; }
    .port-card.featured { grid-column: span 1; }
    .port-card.featured .port-card-name { font-size: 1.4rem; }
    .port-metrics-inner { flex-direction: column; gap: 0; }
    .port-metric { border-right: none; border-bottom: 1px solid var(--border); }
    .port-metric:last-child { border-bottom: none; }
    .port-hero { padding: 100px 20px 60px; }
    .port-grid-wrap { padding: 40px 20px; }
  }
`;

const CATEGORIES = ['All', 'Products', 'Internal Tools', 'Automation', 'Rescue', 'Consulting'];

type Project = {
  id: string;
  name: string;
  category: string;
  featured?: boolean;
  clientType: string;
  problem: string;
  solution: string;
  metrics: { value: string; label: string }[];
  href: string;
  badgeVariant?: 'cat' | 'featured' | 'product';
  specialBadge?: string;
  desc?: string;
  colSpan?: boolean;
};

const PROJECTS: Project[] = [
  {
    id: 'inboxflow',
    name: 'InboxFlow',
    category: 'Products',
    featured: true,
    colSpan: true,
    clientType: 'Solo founder, non-technical',
    problem: 'Built 70% of the product with AI coding tools. Couldn\'t get it to deploy — architecture issues, missing auth, no payment system.',
    solution: 'Code review, architecture fix, Stripe payments + JWT auth, deployment on Railway.',
    metrics: [
      { value: '18 days', label: 'Shipped in' },
      { value: '70%', label: 'AI code preserved' },
      { value: '$3,200', label: 'Total cost' },
    ],
    href: '/studio/portfolio/inboxflow',
  },
  {
    id: 'brightpath',
    name: 'BrightPath Ops Dashboard',
    category: 'Internal Tools',
    featured: true,
    clientType: '30-person logistics company',
    problem: 'Everything tracked in spreadsheets. 4+ hours per day of manual data entry across 3 sheets that kept going out of sync.',
    solution: 'Custom ops dashboard with automated data sync, real-time reporting, and workflow automation.',
    metrics: [
      { value: '3 weeks', label: 'Delivered in' },
      { value: '20 hrs/week', label: 'Saved' },
      { value: 'ROI in 30 days', label: 'Achieved' },
    ],
    href: '/studio/portfolio/brightpath',
  },
  {
    id: 'stylestack',
    name: 'StyleStack Matching Platform',
    category: 'Products',
    clientType: 'Personal styling service',
    problem: 'Client matching managed in Google Sheets. Started breaking at 100 clients.',
    solution: 'AI-powered matching platform, client portal, admin dashboard.',
    metrics: [
      { value: '4 weeks', label: 'Delivered in' },
      { value: '5x', label: 'Client capacity' },
    ],
    href: '/studio/portfolio/stylestack',
  },
  {
    id: 'fabricxai',
    name: 'FabricxAI',
    category: 'Products',
    specialBadge: 'SOCIOFI PRODUCT',
    clientType: 'SocioFi Technology',
    problem: '',
    solution: '',
    desc: '22 AI agents powering garment manufacturing intelligence — from design analysis to production optimization.',
    metrics: [
      { value: '22 agents', label: 'AI-powered' },
    ],
    href: '/products/fabricxai',
  },
  {
    id: 'nexara',
    name: 'NEXARA GTM System',
    category: 'Products',
    clientType: 'B2B SaaS company',
    problem: 'Manual go-to-market execution across disconnected tools and spreadsheets.',
    solution: '13 AI agents managing the entire go-to-market pipeline end to end.',
    metrics: [
      { value: '13 agents', label: 'Automated GTM' },
    ],
    href: '/studio/portfolio/nexara',
  },
];

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 7h10M7 2l5 5-5 5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={A} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="3,8 6.5,11.5 13,5" />
    </svg>
  );
}

function PortfolioCard({ project }: { project: Project }) {
  return (
    <motion.div layout>
      <Link
        href={project.href}
        className={`port-card${project.colSpan ? ' featured' : ''}`}
        style={{ display: 'flex' }}
      >
        <div className="port-card-top">
          <div className="port-card-badges">
            {project.featured && (
              <span className="port-badge port-badge-featured">Featured</span>
            )}
            <span className="port-badge port-badge-cat">{project.category}</span>
            {project.specialBadge && (
              <span className="port-badge port-badge-product">{project.specialBadge}</span>
            )}
          </div>
          <div className="port-arrow" aria-hidden="true">
            <ArrowIcon />
          </div>
        </div>

        <div>
          <h3 className="port-card-name">{project.name}</h3>
          <p className="port-card-client">{project.clientType}</p>
        </div>

        {project.desc ? (
          <p className="port-card-desc">{project.desc}</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <CheckIcon />
              <p className="port-card-problem" style={{ margin: 0 }}>
                <span style={{ fontFamily: F.m, fontSize: '0.72rem', color: A, textTransform: 'uppercase', letterSpacing: '0.08em', marginRight: 6 }}>Problem</span>
                {project.problem}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={A} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="8" cy="8" r="6" /><path d="M8 5v3l2 2" />
              </svg>
              <p className="port-card-problem" style={{ margin: 0 }}>
                <span style={{ fontFamily: F.m, fontSize: '0.72rem', color: A, textTransform: 'uppercase', letterSpacing: '0.08em', marginRight: 6 }}>Solution</span>
                {project.solution}
              </p>
            </div>
          </div>
        )}

        <div className="port-card-metrics">
          {project.metrics.map((m) => (
            <div key={m.label} className="port-card-metric">
              <span className="port-card-metric-val">{m.value}</span>
              <span className="port-card-metric-lab">{m.label}</span>
            </div>
          ))}
        </div>
      </Link>
    </motion.div>
  );
}

export default function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const filtered = activeFilter === 'All'
    ? PROJECTS
    : PROJECTS.filter((p) => p.category === activeFilter);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="port-page">

        {/* Hero */}
        <section className="port-hero">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <p className="port-label">Our Work</p>
            <h1 className="port-hero-title">Real Projects. Running in Production. Right Now.</h1>
            <p className="port-hero-sub">Not mockups. Not concepts. Products that real businesses use every day.</p>
          </motion.div>
        </section>

        {/* Metrics bar */}
        <div className="port-metrics">
          <div className="port-metrics-inner">
            {[
              { val: '12', lab: 'Projects Delivered' },
              { val: '3 Weeks', lab: 'Average Ship Time' },
              { val: '100%', lab: 'Client Retention' },
            ].map((m) => (
              <div key={m.lab} className="port-metric">
                <span className="port-metric-val">{m.val}</span>
                <span className="port-metric-lab">{m.lab}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filter bar */}
        <div className="port-filter-wrap">
          <div className="port-filter" role="tablist" aria-label="Filter projects by category">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={activeFilter === cat}
                className={`port-filter-tab${activeFilter === cat ? ' active' : ''}`}
                onClick={() => setActiveFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Bento Grid */}
        <div className="port-grid-wrap">
          <AnimatePresence mode="popLayout">
            {mounted && (
              <motion.div
                className="port-grid"
                layout
              >
                {filtered.map((project) => (
                  <PortfolioCard key={project.id} project={project} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CTA */}
        <section className="port-cta">
          <div className="port-cta-inner">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <p className="port-label" style={{ justifyContent: 'center' }}>Start a project</p>
              <h2 className="port-cta-title">Want your project here?</h2>
              <p className="port-cta-sub">Tell us what you need. We scope it, price it, and build it — in plain English, on a fixed timeline.</p>
              <div className="port-cta-btns">
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
