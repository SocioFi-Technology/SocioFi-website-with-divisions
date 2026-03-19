'use client';
import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { agents, CATEGORY_META, CATEGORY_ORDER } from '@/lib/agents';

const A = '#8B5CF6';
const F = {
  h: "var(--font-manrope,'Manrope'),sans-serif",
  b: "var(--font-dm-sans,'DM Sans'),sans-serif",
  m: "var(--font-jb-mono,'JetBrains Mono'),monospace",
};

const STYLES = `
  .ag-hero { position:relative; min-height:100dvh; display:flex; align-items:center; justify-content:center; overflow:hidden; padding-top:80px; }
  .ag-canvas { position:absolute; inset:0; width:100%; height:100%; pointer-events:none; }
  .ag-badge { display:inline-flex; align-items:center; gap:8px; padding:6px 14px; border-radius:100px; background:rgba(139,92,246,0.12); border:1px solid rgba(139,92,246,0.3); font-family:${F.m}; font-size:0.7rem; color:${A}; letter-spacing:0.12em; text-transform:uppercase; margin-bottom:24px; }
  .ag-badge-dot { width:6px; height:6px; border-radius:50%; background:${A}; animation:ag-pulse 2s infinite; }
  @keyframes ag-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
  .ag-h1 { font-family:${F.h}; font-size:clamp(2.4rem,5vw,4rem); font-weight:800; line-height:1.08; letter-spacing:-0.03em; color:var(--text-primary); margin:0 0 20px; max-width:780px; }
  .ag-h1 .vi { background:linear-gradient(135deg,${A} 0%,#C4B5FD 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .ag-sub { font-family:${F.b}; font-size:1.1rem; line-height:1.75; color:var(--text-secondary); max-width:600px; margin:0 0 36px; }
  .ag-ctas { display:flex; gap:14px; flex-wrap:wrap; margin-bottom:24px; }
  .ag-btn-pri { display:inline-flex; align-items:center; gap:8px; padding:14px 28px; border-radius:10px; background:linear-gradient(135deg,${A} 0%,#7C3AED 100%); color:#fff; font-family:${F.h}; font-size:0.9rem; font-weight:600; text-decoration:none; box-shadow:0 4px 24px rgba(139,92,246,0.35); transition:transform 0.2s,box-shadow 0.2s; }
  .ag-btn-pri:hover { transform:translateY(-2px) scale(1.02); box-shadow:0 8px 32px rgba(139,92,246,0.5); }
  .ag-btn-ghost { display:inline-flex; align-items:center; gap:8px; padding:14px 28px; border-radius:10px; border:1.5px solid var(--border); color:var(--text-primary); font-family:${F.h}; font-size:0.9rem; font-weight:600; text-decoration:none; transition:border-color 0.2s,color 0.2s; }
  .ag-btn-ghost:hover { border-color:${A}; color:${A}; }
  .ag-price-note { font-family:${F.m}; font-size:0.72rem; color:var(--text-muted); letter-spacing:0.06em; }
  .ag-section { padding:100px 0; }
  .ag-container { max-width:1200px; margin:0 auto; padding:0 32px; }
  .ag-label { font-family:${F.m}; font-size:0.72rem; font-weight:500; color:${A}; text-transform:uppercase; letter-spacing:0.12em; margin-bottom:14px; display:flex; align-items:center; gap:10px; }
  .ag-label::before { content:''; width:20px; height:1.5px; background:${A}; display:inline-block; }
  .ag-h2 { font-family:${F.h}; font-size:clamp(1.8rem,3vw,2.4rem); font-weight:700; line-height:1.15; letter-spacing:-0.02em; color:var(--text-primary); margin:0 0 16px; }
  .ag-h2 .vi { background:linear-gradient(135deg,${A} 0%,#C4B5FD 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .ag-body { font-family:${F.b}; font-size:1rem; line-height:1.7; color:var(--text-secondary); }
  .ag-glass { background:var(--glass-bg,rgba(17,17,40,0.6)); border:1px solid rgba(139,92,246,0.15); border-radius:16px; backdrop-filter:blur(12px); }
  .ag-quote { padding:40px 48px; position:relative; }
  .ag-quote-mark { font-family:${F.h}; font-size:5rem; line-height:1; color:${A}; opacity:0.15; position:absolute; top:16px; left:40px; pointer-events:none; }
  .ag-quote-text { font-family:${F.h}; font-size:1.35rem; font-weight:600; line-height:1.5; color:var(--text-primary); margin-bottom:16px; }
  .ag-quote-attr { font-family:${F.m}; font-size:0.72rem; color:${A}; letter-spacing:0.08em; }
  .ag-cat-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:20px; }
  .ag-cat-card { background:var(--bg-card); border:1px solid var(--border); border-radius:16px; padding:28px; transition:transform 0.3s,border-color 0.3s,box-shadow 0.3s; cursor:default; position:relative; overflow:hidden; }
  .ag-cat-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,${A},#C4B5FD); opacity:0; transition:opacity 0.3s; }
  .ag-cat-card:hover { transform:translateY(-4px); border-color:rgba(139,92,246,0.3); box-shadow:0 12px 40px rgba(139,92,246,0.12); }
  .ag-cat-card:hover::before { opacity:1; }
  .ag-cat-icon { width:44px; height:44px; border-radius:10px; background:rgba(139,92,246,0.1); display:flex; align-items:center; justify-content:center; margin-bottom:16px; font-size:1.4rem; }
  .ag-cat-title { font-family:${F.h}; font-size:1.05rem; font-weight:700; color:var(--text-primary); margin-bottom:8px; }
  .ag-cat-desc { font-family:${F.b}; font-size:0.85rem; color:var(--text-secondary); line-height:1.5; margin-bottom:16px; }
  .ag-cat-tasks { list-style:none; padding:0; margin:0 0 16px; display:flex; flex-direction:column; gap:6px; }
  .ag-cat-tasks li { font-family:${F.b}; font-size:0.8rem; color:var(--text-muted); display:flex; align-items:center; gap:6px; }
  .ag-cat-tasks li::before { content:''; width:4px; height:4px; border-radius:50%; background:${A}; flex-shrink:0; }
  .ag-cat-link { font-family:${F.h}; font-size:0.82rem; font-weight:600; color:${A}; text-decoration:none; display:flex; align-items:center; gap:4px; }
  .ag-cat-link:hover { text-decoration:underline; }
  .ag-steps { display:grid; grid-template-columns:repeat(3,1fr); gap:32px; }
  @media(max-width:768px) { .ag-steps { grid-template-columns:1fr; } .ag-cat-grid { grid-template-columns:1fr 1fr; } }
  @media(max-width:480px) { .ag-cat-grid { grid-template-columns:1fr; } }
  .ag-step { position:relative; }
  .ag-step-num { font-family:${F.h}; font-size:4rem; font-weight:800; color:${A}; opacity:0.15; line-height:1; margin-bottom:12px; }
  .ag-step-title { font-family:${F.h}; font-size:1.1rem; font-weight:700; color:var(--text-primary); margin-bottom:8px; }
  .ag-step-desc { font-family:${F.b}; font-size:0.9rem; color:var(--text-secondary); line-height:1.6; }
  .ag-agent-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
  @media(max-width:1024px) { .ag-agent-grid { grid-template-columns:1fr 1fr; } }
  @media(max-width:600px) { .ag-agent-grid { grid-template-columns:1fr; } }
  .ag-agent-card { background:var(--bg-card); border:1px solid var(--border); border-radius:16px; padding:28px; transition:transform 0.3s,border-color 0.3s,box-shadow 0.3s; position:relative; overflow:hidden; display:flex; flex-direction:column; }
  .ag-agent-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,${A},#C4B5FD); opacity:0; transition:opacity 0.3s; }
  .ag-agent-card:hover { transform:translateY(-4px); border-color:rgba(139,92,246,0.3); box-shadow:0 12px 40px rgba(139,92,246,0.12); }
  .ag-agent-card:hover::before { opacity:1; }
  .ag-agent-cat { font-family:${F.m}; font-size:0.68rem; color:${A}; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:10px; }
  .ag-agent-name { font-family:${F.h}; font-size:1.1rem; font-weight:800; color:var(--text-primary); margin-bottom:8px; }
  .ag-agent-desc { font-family:${F.b}; font-size:0.85rem; color:var(--text-secondary); line-height:1.6; margin-bottom:16px; flex:1; }
  .ag-agent-price { font-family:${F.h}; font-size:1.1rem; font-weight:700; color:${A}; margin-bottom:16px; }
  .ag-agent-price span { font-family:${F.b}; font-size:0.78rem; font-weight:400; color:var(--text-muted); }
  .ag-agent-link { font-family:${F.h}; font-size:0.82rem; font-weight:600; color:${A}; text-decoration:none; display:inline-flex; align-items:center; gap:4px; }
  .ag-agent-link:hover { text-decoration:underline; }
  .ag-proof { display:grid; grid-template-columns:1fr 1fr 1fr; gap:24px; margin-top:40px; }
  @media(max-width:768px) { .ag-proof { grid-template-columns:1fr; } }
  .ag-metric { text-align:center; padding:28px; background:var(--bg-card); border:1px solid var(--border); border-radius:16px; }
  .ag-metric-num { font-family:${F.h}; font-size:2.4rem; font-weight:800; color:${A}; margin-bottom:6px; }
  .ag-metric-label { font-family:${F.b}; font-size:0.85rem; color:var(--text-secondary); }
  .ag-pricing-row { display:grid; grid-template-columns:1fr 1fr; gap:24px; }
  @media(max-width:768px) { .ag-pricing-row { grid-template-columns:1fr; } }
  .ag-price-card { background:var(--bg-card); border:1px solid var(--border); border-radius:16px; padding:32px; }
  .ag-price-card.featured { border-color:rgba(139,92,246,0.4); box-shadow:0 0 0 1px rgba(139,92,246,0.2); }
  .ag-divider { height:1px; background:var(--border); margin:0; }
  .ag-bg-alt { background:var(--bg-2); }
`;

function NeuralNetworkBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animId: number;
    let dots: { x: number; y: number; vx: number; vy: number; r: number }[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 40; i++) {
      dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: 2 + Math.random(),
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach(d => {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0) d.x = canvas.width;
        if (d.x > canvas.width) d.x = 0;
        if (d.y < 0) d.y = canvas.height;
        if (d.y > canvas.height) d.y = 0;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(139,92,246,0.6)';
        ctx.fill();
      });
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = `rgba(139,92,246,${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="ag-canvas" />;
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

const Icons = {
  Chart: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  ),
  Target: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  Headset: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
    </svg>
  ),
  Database: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>
    </svg>
  ),
  FileText: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
};

const CATEGORIES = [
  { key: 'operations', icon: <Icons.Chart />, label: 'Operations', desc: 'Reports, inventory, compliance, meeting summaries', tasks: ['Weekly reports, auto-sent', 'Stock level monitoring', 'Compliance document review', 'Meeting notes + action items'] },
  { key: 'sales', icon: <Icons.Target />, label: 'Sales', desc: 'Lead qualification, proposals, CRM updates', tasks: ['Score and route inbound leads', 'Draft proposals from briefs', 'Keep CRM clean automatically'] },
  { key: 'support', icon: <Icons.Headset />, label: 'Support', desc: 'Customer service, ticket triage, review responses', tasks: ['24/7 first-line responses', 'Categorize and route tickets', 'Respond to reviews on-brand'] },
  { key: 'data', icon: <Icons.Database />, label: 'Data', desc: 'Processing, cleaning, email triage, social monitoring', tasks: ['Clean and transform data', 'Intelligent inbox management', 'Brand mention monitoring'] },
  { key: 'documents', icon: <Icons.FileText />, label: 'Documents', desc: 'Contracts, invoices, summaries, extraction', tasks: ['Extract data from any document', 'Analyze contracts for risks', 'Executive summary generation'] },
];

const FEATURED_SLUGS = ['report-generator', 'customer-service', 'lead-qualifier'];

export default function AgentsPage() {
  const featuredAgents = FEATURED_SLUGS.map(s => agents.find(a => a.slug === s)).filter(Boolean) as typeof agents;

  return (
    <>
      <style>{STYLES}</style>

      {/* Hero */}
      <section className="ag-hero">
        <NeuralNetworkBg />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(139,92,246,0.07) 0%, transparent 70%)' }} />
        <div className="ag-container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="ag-badge"><span className="ag-badge-dot" />Agent-as-a-Service</div>
          </motion.div>
          <motion.h1 className="ag-h1" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            AI Agents That Work for Your Business.<br />Subscribe. Deploy. <span className="vi">Scale.</span>
          </motion.h1>
          <motion.p className="ag-sub" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            Pre-built AI agents that handle real business tasks — reports, lead qualification, customer service, data processing. No code. No complexity. Just results.
          </motion.p>
          <motion.div className="ag-ctas" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}>
            <Link href="/agents/catalog" className="ag-btn-pri">Browse the Agent Catalog →</Link>
            <Link href="/agents/how-it-works" className="ag-btn-ghost">See How It Works</Link>
          </motion.div>
          <motion.p className="ag-price-note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            Starting from $149/month per agent &nbsp;·&nbsp; No contracts &nbsp;·&nbsp; Cancel anytime
          </motion.p>
        </div>
      </section>

      {/* Jensen Huang Quote */}
      <section className="ag-section ag-bg-alt">
        <div className="ag-container">
          <Reveal>
            <div className="ag-glass ag-quote" style={{ maxWidth: 760, margin: '0 auto', borderColor: 'rgba(139,92,246,0.2)' }}>
              <div className="ag-quote-mark">"</div>
              <p className="ag-quote-text" style={{ paddingTop: 16 }}>
                "Every company will have a team of AI agents working alongside humans. The question isn't whether — it's which tasks and how soon."
              </p>
              <div className="ag-quote-attr">Jensen Huang &nbsp;·&nbsp; CEO, NVIDIA &nbsp;·&nbsp; Paraphrased from public remarks, 2024</div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* What Kind of Work — 5 category cards */}
      <section className="ag-section">
        <div className="ag-container">
          <Reveal>
            <div className="ag-label">What Agents Handle</div>
            <h2 className="ag-h2" style={{ marginBottom: 8 }}>Five categories of work, <span className="vi">fully covered.</span></h2>
            <p className="ag-body" style={{ marginBottom: 40, maxWidth: 560 }}>
              Every agent is purpose-built for a specific category of business work. Pick the ones that match your biggest bottlenecks.
            </p>
          </Reveal>
          <div className="ag-cat-grid">
            {CATEGORIES.map((cat, i) => (
              <Reveal key={cat.key} delay={i * 0.08}>
                <div className="ag-cat-card">
                  <div className="ag-cat-icon" style={{ color: A }}>{cat.icon}</div>
                  <div className="ag-cat-title">{cat.label}</div>
                  <div className="ag-cat-desc">{cat.desc}</div>
                  <ul className="ag-cat-tasks">
                    {cat.tasks.map(t => <li key={t}>{t}</li>)}
                  </ul>
                  <Link href={`/agents/categories/${cat.key}`} className="ag-cat-link">Browse agents →</Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works — 3 steps */}
      <section className="ag-section ag-bg-alt">
        <div className="ag-container">
          <Reveal>
            <div className="ag-label">How It Works</div>
            <h2 className="ag-h2" style={{ marginBottom: 40 }}>Choose. Connect. <span className="vi">Deploy.</span></h2>
          </Reveal>
          <div className="ag-steps">
            {[
              { n: '01', title: 'Choose your agents', desc: 'Browse the catalog and pick the agents that match your needs. Mix and match — most clients start with 2-3.' },
              { n: '02', title: 'Connect your tools', desc: 'We handle the integration setup. Tell us what software you use — Slack, HubSpot, Gmail, Sheets — we connect the dots.' },
              { n: '03', title: 'Deploy and run', desc: 'Setup takes 3-7 business days. After that, agents run automatically. You get reports, alerts, and can pause anytime.' },
            ].map((s, i) => (
              <Reveal key={s.n} delay={i * 0.1}>
                <div className="ag-step">
                  <div className="ag-step-num">{s.n}</div>
                  <div className="ag-step-title">{s.title}</div>
                  <div className="ag-step-desc">{s.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.3}>
            <div style={{ marginTop: 40 }}>
              <Link href="/agents/how-it-works" className="ag-btn-ghost">Full explanation →</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Kamrul CTO Quote */}
      <section className="ag-section">
        <div className="ag-container">
          <Reveal>
            <div className="ag-glass ag-quote" style={{ maxWidth: 700, margin: '0 auto', borderColor: 'rgba(139,92,246,0.2)' }}>
              <div className="ag-quote-mark">"</div>
              <p className="ag-quote-text" style={{ paddingTop: 16 }}>
                "We built every agent in this catalog to solve a problem we've seen real businesses struggle with. Not hypothetical use cases — actual workflows our clients used to do manually."
              </p>
              <div className="ag-quote-attr">Kamrul Hasan &nbsp;·&nbsp; CTO, SocioFi Technology &nbsp;·&nbsp; BUET Graduate</div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Featured Agents */}
      <section className="ag-section ag-bg-alt">
        <div className="ag-container">
          <Reveal>
            <div className="ag-label">Featured Agents</div>
            <h2 className="ag-h2" style={{ marginBottom: 8 }}>Most popular agents <span className="vi">this month.</span></h2>
            <p className="ag-body" style={{ marginBottom: 40 }}>These three agents cover the most common bottlenecks across our client base.</p>
          </Reveal>
          <div className="ag-agent-grid">
            {featuredAgents.map((agent, i) => (
              <Reveal key={agent.slug} delay={i * 0.1}>
                <div className="ag-agent-card">
                  <div className="ag-agent-cat">{CATEGORY_META[agent.category].label}</div>
                  <div className="ag-agent-name">{agent.name}</div>
                  <div className="ag-agent-desc">{agent.tagline}</div>
                  <div className="ag-agent-price">${agent.price}<span>/month</span></div>
                  <Link href={`/agents/catalog/${agent.slug}`} className="ag-agent-link">Learn more →</Link>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.3}>
            <div style={{ marginTop: 36, textAlign: 'center' }}>
              <Link href="/agents/catalog" className="ag-btn-pri">See All 16 Agents →</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Proof Section */}
      <section className="ag-section">
        <div className="ag-container">
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div className="ag-label" style={{ justifyContent: 'center' }}>In Production</div>
              <h2 className="ag-h2">45+ agents running in production. <span className="vi">Not demos.</span></h2>
              <p className="ag-body" style={{ maxWidth: 520, margin: '12px auto 0' }}>
                These agents power SocioFi&apos;s own products — FabricxAI and NEXUS ARIA — and have processed millions of tasks.
              </p>
            </div>
          </Reveal>
          <div className="ag-proof">
            {[
              { num: '45+', label: 'Agents deployed across client environments' },
              { num: '3–7', label: 'Business days from signup to running' },
              { num: '80%', label: 'Average time saved on targeted tasks' },
            ].map((m, i) => (
              <Reveal key={m.num} delay={i * 0.1}>
                <div className="ag-metric">
                  <div className="ag-metric-num">{m.num}</div>
                  <div className="ag-metric-label">{m.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.3}>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 36, flexWrap: 'wrap' }}>
              <Link href="/products/fabricxai" className="ag-btn-ghost" style={{ fontSize: '0.84rem' }}>FabricxAI →</Link>
              <Link href="/products/nexus-aria" className="ag-btn-ghost" style={{ fontSize: '0.84rem' }}>NEXUS ARIA →</Link>
              <Link href="/agents/case-studies" className="ag-btn-ghost" style={{ fontSize: '0.84rem' }}>Case Studies →</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="ag-section ag-bg-alt">
        <div className="ag-container">
          <Reveal>
            <div className="ag-label">Pricing</div>
            <h2 className="ag-h2" style={{ marginBottom: 8 }}>One agent or ten. <span className="vi">It scales.</span></h2>
            <p className="ag-body" style={{ marginBottom: 40, maxWidth: 520 }}>Per-agent monthly pricing with no lock-in. Bundle for discounts. Cancel anytime.</p>
          </Reveal>
          <div className="ag-pricing-row">
            <Reveal>
              <div className="ag-price-card">
                <div style={{ fontFamily: F.h, fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: 8 }}>Single Agent</div>
                <div style={{ fontFamily: F.h, fontWeight: 800, fontSize: '2rem', color: A, marginBottom: 4 }}>From $149<span style={{ fontFamily: F.b, fontWeight: 400, fontSize: '0.9rem', color: 'var(--text-muted)' }}>/mo</span></div>
                <div style={{ fontFamily: F.b, fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.6 }}>Pick any agent from the catalog. Includes setup, integrations, and monitoring.</div>
                <Link href="/agents/pricing" className="ag-btn-ghost" style={{ display: 'inline-flex', fontSize: '0.84rem' }}>View pricing →</Link>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="ag-price-card featured">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ fontFamily: F.h, fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Agent Bundles</div>
                  <div style={{ fontFamily: F.m, fontSize: '0.68rem', color: '#fff', background: A, borderRadius: 100, padding: '2px 10px', letterSpacing: '0.08em' }}>SAVE UP TO 25%</div>
                </div>
                <div style={{ fontFamily: F.h, fontWeight: 800, fontSize: '2rem', color: A, marginBottom: 4 }}>Team, Growth, Business</div>
                <div style={{ fontFamily: F.b, fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.6 }}>Bundle 3+ agents for 15-25% off. Most clients run 4-6 agents for full coverage.</div>
                <Link href="/agents/pricing" className="ag-btn-pri" style={{ fontSize: '0.84rem' }}>See bundles →</Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA + Arifur Quote */}
      <section className="ag-section" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(139,92,246,0.08) 0%, transparent 70%)' }}>
        <div className="ag-container" style={{ textAlign: 'center' }}>
          <Reveal>
            <div className="ag-label" style={{ justifyContent: 'center' }}>Get Started</div>
            <h2 className="ag-h2" style={{ marginBottom: 16 }}>Ready to deploy your first agent?</h2>
            <p className="ag-body" style={{ maxWidth: 480, margin: '0 auto 36px' }}>
              Tell us what you need. We&apos;ll recommend the right agents and get them running in under a week.
            </p>
            <div className="ag-ctas" style={{ justifyContent: 'center' }}>
              <Link href="/agents/deploy" className="ag-btn-pri">Deploy an Agent →</Link>
              <Link href="/agents/catalog" className="ag-btn-ghost">Browse the Catalog</Link>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="ag-glass ag-quote" style={{ maxWidth: 640, margin: '48px auto 0', borderColor: 'rgba(139,92,246,0.2)' }}>
              <div className="ag-quote-mark">"</div>
              <p className="ag-quote-text" style={{ paddingTop: 16 }}>
                "We don&apos;t sell you software. We deploy working agents that save your team real hours every week. If it doesn&apos;t work, we fix it until it does."
              </p>
              <div className="ag-quote-attr">Arifur Rahman &nbsp;·&nbsp; CEO, SocioFi Technology &nbsp;·&nbsp; BUET Graduate</div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
