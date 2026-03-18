'use client';

import React, { useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Container from '@/components/shared/Container';
import Button from '@/components/shared/Button';
import AnimatedGrid from '@/components/visual/AnimatedGrid';

/* ─── Division colours (verified from logo SVGs) ─────────────────────── */
const C = {
  studio: '#72C4B2', agents: '#8B5CF6', services: '#4DBFA8',
  cloud: '#5BB5E0', labs: '#7B6FE8', products: '#E8916F',
  academy: '#E8B84D', ventures: '#6BA3E8', navy: '#3A589E',
};

/* ─── Styles ──────────────────────────────────────────────────────────── */
const STYLES = `
  .hp-s { padding: 100px 0; }
  .hp-s-sm { padding: 80px 0; }
  .hp-alt { background: var(--bg-2); }

  .g3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
  .g4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; }
  .g2 { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
  .build-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }

  .cmp-table { width: 100%; border-collapse: collapse; }
  .cmp-table th, .cmp-table td { padding: 12px 16px; text-align: left; border-bottom: 1px solid var(--border); font-family: var(--font-body); font-size: 0.88rem; }
  .cmp-table th { font-family: var(--font-mono); font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); font-weight: 500; }
  .cmp-table td { color: var(--text-secondary); }
  .cmp-table td:first-child { color: var(--text-primary); font-weight: 500; }
  .cmp-sf { color: var(--teal-light) !important; font-weight: 600 !important; }

  .grad-text {
    background: linear-gradient(135deg, var(--navy-bright), var(--teal) 60%, var(--teal-pale));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  @media (forced-colors: active) { .grad-text { -webkit-text-fill-color: unset; } }

  @keyframes hp-shimmer {
    0% { background-position: 200% center; }
    100% { background-position: -200% center; }
  }
  .hp-shimmer {
    background: linear-gradient(90deg, #4A6CB8, #72C4B2 30%, #A3DFD2 50%, #72C4B2 70%, #4A6CB8);
    background-size: 200% auto;
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    animation: hp-shimmer 5s linear infinite;
  }

  .pill { display: inline-flex; align-items: center; gap: 6px; padding: 5px 14px; font-family: var(--font-body); font-size: 0.8rem; border: 1px solid var(--border); border-radius: 100px; color: var(--text-secondary); text-decoration: none; transition: border-color 0.2s, color 0.2s; }
  .pill:hover { color: var(--text-primary); border-color: var(--border-hover); }

  .flow-bar { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: center; font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted); letter-spacing: 0.06em; }

  @media (max-width: 1024px) { .g4 { grid-template-columns: repeat(2,1fr) !important; } }
  @media (max-width: 900px) {
    .g3 { grid-template-columns: 1fr !important; }
    .build-grid { grid-template-columns: 1fr !important; }
  }
  @media (max-width: 768px) {
    .hp-s { padding: 72px 0; }
    .hp-s-sm { padding: 56px 0; }
    .g2 { grid-template-columns: 1fr !important; }
    .g4 { grid-template-columns: 1fr 1fr !important; }
  }
  @media (max-width: 480px) { .g4 { grid-template-columns: 1fr !important; } }
  @media (prefers-reduced-motion: reduce) { .hp-shimmer { animation: none; } }
`;

/* ─── Primitives ──────────────────────────────────────────────────────── */

function Badge({ children, color }: { children: React.ReactNode; color?: string }) {
  const c = color ?? 'var(--teal-light)';
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '5px 14px', background: `color-mix(in srgb, ${c} 10%, transparent)`,
      border: `1px solid color-mix(in srgb, ${c} 25%, transparent)`, borderRadius: 100,
      fontFamily: 'var(--font-mono)', fontSize: '0.64rem', fontWeight: 500,
      color: c, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 24,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: c, flexShrink: 0 }} aria-hidden="true" />
      {children}
    </div>
  );
}

function Fade({ children, d = 0, style }: { children: React.ReactNode; d?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const v = useInView(ref, { once: true, margin: '-6% 0px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={v ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: d }} style={style}>
      {children}
    </motion.div>
  );
}

function H2({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1.15, color: 'var(--text-primary)', ...style }}>{children}</h2>;
}

function P({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', lineHeight: 1.75, color: 'var(--text-secondary)', ...style }}>{children}</p>;
}

function Card({ children, accent, featured, style, topAccent }: { children: React.ReactNode; accent?: string; featured?: boolean; style?: React.CSSProperties; topAccent?: string }) {
  const [h, setH] = useState(false);
  const a = accent ?? C.studio;
  const bc = h ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)';
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      background: featured ? `radial-gradient(ellipse at top left, color-mix(in srgb, ${a} 8%, var(--bg-card)), var(--bg-card) 60%)` : 'var(--bg-card)',
      borderTop: topAccent ? `2px solid ${topAccent}` : `1px solid ${bc}`,
      borderRight: `1px solid ${bc}`,
      borderBottom: `1px solid ${bc}`,
      borderLeft: `1px solid ${bc}`,
      borderRadius: 18, padding: '28px 32px', position: 'relative', overflow: 'hidden',
      transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.25s',
      transform: h ? 'translateY(-2px)' : 'none',
      boxShadow: h ? `0 0 0 1px ${a}30, 0 16px 32px rgba(0,0,0,0.15)` : featured ? `0 0 0 1px ${a}18` : 'none',
      ...style,
    }}>
      {children}
    </div>
  );
}

function Glass({ children, accent, style }: { children: React.ReactNode; accent?: string; style?: React.CSSProperties }) {
  const a = accent ?? C.studio;
  return (
    <div style={{
      background: `radial-gradient(ellipse at top left, color-mix(in srgb, ${a} 6%, var(--bg-card)), var(--bg-card) 70%)`,
      borderTop: '1px solid rgba(255,255,255,0.07)',
      borderRight: '1px solid rgba(255,255,255,0.07)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      borderLeft: `2px solid ${a}60`,
      borderRadius: 14, padding: '28px 32px', ...style,
    }}>
      {children}
    </div>
  );
}

const cardTitle: React.CSSProperties = { fontFamily: 'var(--font-headline)', fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em', marginBottom: 8, lineHeight: 1.3 };
const cardBody: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: '0.88rem', lineHeight: 1.7, color: 'var(--text-secondary)' };
const monoTag: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '0.62rem', fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: '0.1em' };

/* ─── Sections ────────────────────────────────────────────────────────── */

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const o1 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const o2 = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <section ref={ref} style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', background: 'var(--bg)', overflow: 'hidden', paddingTop: 80 }}>
      <AnimatedGrid />
      <motion.div aria-hidden="true" style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, var(--navy), transparent 70%)', top: '-15%', left: '-10%', opacity: 'var(--glow-opacity)' as React.CSSProperties['opacity'], filter: 'blur(80px)', y: o1 }} />
      <motion.div aria-hidden="true" style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, var(--teal), transparent 70%)', bottom: '-10%', right: '-5%', opacity: 'var(--glow-opacity)' as React.CSSProperties['opacity'], filter: 'blur(80px)', y: o2 }} />

      <Container wide style={{ position: 'relative', zIndex: 2, paddingTop: 48, paddingBottom: 64 }}>
        <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} style={{ maxWidth: 780 }}>
          <Badge>AI-Powered Software Development</Badge>

          <h1 style={{
            fontFamily: 'var(--font-headline)', fontSize: 'clamp(2.6rem, 5.5vw, 4.4rem)',
            fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.08,
            marginBottom: 24, color: 'var(--text-primary)',
          }}>
            Ship production software{' '}
            <span className="hp-shimmer">in weeks, not months.</span>
          </h1>

          <P style={{ maxWidth: 520, marginBottom: 36, fontSize: '1.05rem' }}>
            AI writes the code. Our engineers make sure it actually works.
            Architecture, deployment, security, maintenance — handled.
          </P>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 32 }}>
            <Button href="/contact" variant="primary" size="lg">Start a Project</Button>
            <Button href="/studio/portfolio" variant="ghost" size="lg">See Our Work</Button>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { label: 'Custom software', url: '/studio', color: C.studio },
              { label: 'AI agents', url: '/agents', color: C.agents },
              { label: 'Maintenance', url: '/services', color: C.services },
            ].map(r => (
              <Link key={r.label} href={r.url} className="pill" style={{ borderColor: r.color + '40', color: r.color }}>{r.label}</Link>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }}
          style={{ display: 'flex', gap: 48, flexWrap: 'wrap', marginTop: 72, paddingTop: 32, borderTop: '1px solid var(--border)' }}>
          {[
            { n: '45+', l: 'Production Agents' },
            { n: '3', l: 'Live Platforms' },
            { n: '2–6 wk', l: 'Avg. Delivery' },
            { n: '8', l: 'Divisions' },
          ].map(m => (
            <div key={m.l}>
              <div style={{ fontFamily: 'var(--font-headline)', fontSize: '1.8rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{m.n}</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>{m.l}</div>
            </div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

function Problem() {
  const cards = [
    { tag: 'Agencies', body: '$50K–200K. 3–6 months. Twelve people, half invisible. Another contract just to keep it running.' },
    { tag: 'DIY / AI tools', body: 'You built a prototype. Then deployment, databases, auth, and security happened.', link: { label: 'We rescue stuck projects', url: '/studio/services/rescue-ship' } },
    { tag: 'Freelancers', body: 'Cheaper — until they disappear. Now you\'re managing code you don\'t understand.' },
  ];
  return (
    <section className="hp-s hp-alt">
      <Container>
        <Fade>
          <Badge>The Problem</Badge>
          <H2 style={{ maxWidth: 560, marginBottom: 40 }}>Traditional options don&apos;t work for how software gets built today.</H2>
        </Fade>
        <div className="g3">
          {cards.map((c, i) => (
            <Fade key={c.tag} d={i * 0.08}>
              <Card style={{ height: '100%' }}>
                <div style={{ ...monoTag, color: 'var(--text-muted)', marginBottom: 10 }}>{c.tag}</div>
                <p style={cardBody}>{c.body}</p>
                {c.link && <Link href={c.link.url} style={{ ...cardBody, color: C.studio, textDecoration: 'none', display: 'block', marginTop: 12, fontSize: '0.84rem' }}>{c.link.label} →</Link>}
              </Card>
            </Fade>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Solution() {
  return (
    <section className="hp-s" style={{ background: 'var(--bg)' }}>
      <Container>
        <Fade>
          <Badge>Our Approach</Badge>
          <H2 style={{ maxWidth: 560, marginBottom: 40 }}>
            AI generates code fast.{' '}
            <span className="grad-text">We make it production-ready.</span>
          </H2>
        </Fade>
        <div className="g2" style={{ marginBottom: 32 }}>
          <Fade>
            <Card accent={C.studio} topAccent={C.studio}>
              <div style={{ ...monoTag, color: C.studio, marginBottom: 16 }}>What AI handles</div>
              {['Initial codebase in hours', 'Tests, docs, and boilerplate', 'Repetitive development tasks', 'Powering deployed AI agents'].map(t => (
                <div key={t} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                  <span style={{ color: C.studio, fontSize: '0.65rem', marginTop: 5 }}>▸</span>
                  <span style={cardBody}>{t}</span>
                </div>
              ))}
            </Card>
          </Fade>
          <Fade d={0.1}>
            <Card accent={C.navy} topAccent="var(--teal-light)">
              <div style={{ ...monoTag, color: 'var(--teal-light)', marginBottom: 16 }}>What our engineers handle</div>
              {['Architecture that scales', 'Code review before anything ships', 'Deployment, databases, security', 'Debugging and ongoing maintenance'].map(t => (
                <div key={t} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                  <span style={{ color: 'var(--teal-light)', fontSize: '0.65rem', marginTop: 5 }}>▸</span>
                  <span style={cardBody}>{t}</span>
                </div>
              ))}
            </Card>
          </Fade>
        </div>
        <Fade d={0.15}>
          <Glass accent={C.studio}>
            <P style={{ marginBottom: 8 }}>Every line of code is reviewed by a human engineer before it ships. Not spot-checked — reviewed.</P>
            <Link href="/studio/process" style={{ fontFamily: 'var(--font-body)', fontSize: '0.84rem', color: C.studio, textDecoration: 'none' }}>See our process →</Link>
          </Glass>
        </Fade>
      </Container>
    </section>
  );
}

function Process() {
  const steps = [
    { n: '01', t: 'You tell us what you need', sub: 'In business terms. 30 min. Free.', link: { l: 'Book a call', u: '/contact' } },
    { n: '02', t: 'We plan and price it', sub: 'Plain-English proposal. Fixed cost. You approve first.' },
    { n: '03', t: 'We build it', sub: 'AI generates, engineers review. Weekly updates.', link: { l: 'Studio', u: '/studio' } },
    { n: '04', t: 'You launch', sub: 'Deployed to production. Real hosting, real monitoring.', link: { l: 'Cloud', u: '/cloud' } },
    { n: '05', t: 'We maintain it', sub: 'Same team. Bug fixes, features, security. Ongoing.', link: { l: 'Services', u: '/services' } },
  ];
  return (
    <section className="hp-s hp-alt">
      <Container>
        <Fade>
          <Badge>How It Works</Badge>
          <H2 style={{ maxWidth: 480, marginBottom: 48 }}>Idea to production in five steps.</H2>
        </Fade>
        {steps.map((s, i) => (
          <Fade key={s.n} d={i * 0.06}>
            <div style={{ display: 'grid', gridTemplateColumns: '56px 1fr', gap: 24, paddingBottom: 28, marginBottom: 28, borderBottom: i < steps.length - 1 ? '1px solid var(--border)' : 'none', alignItems: 'start' }}>
              <div style={{ fontFamily: 'var(--font-headline)', fontSize: '2rem', fontWeight: 600, color: 'var(--border-hover)', letterSpacing: '-0.03em' }}>{s.n}</div>
              <div>
                <h3 style={{ ...cardTitle, fontSize: '1.1rem', marginBottom: 4 }}>{s.t}</h3>
                <P style={{ fontSize: '0.88rem', maxWidth: 520 }}>{s.sub}</P>
                {s.link && <Link href={s.link.u} style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: C.studio, textDecoration: 'none', marginTop: 6, display: 'inline-block' }}>{s.link.l} →</Link>}
              </div>
            </div>
          </Fade>
        ))}
        <Fade>
          <div className="flow-bar" style={{ marginTop: 8 }}>
            {['Studio', 'Cloud', 'Services'].map((n, i, a) => (
              <React.Fragment key={n}>
                <Link href={`/${n.toLowerCase()}`} style={{ color: C[n.toLowerCase() as keyof typeof C], textDecoration: 'none', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>[{n}]</Link>
                {i < a.length - 1 && <span style={{ color: 'var(--text-muted)' }}>→</span>}
              </React.Fragment>
            ))}
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>— One team, start to finish.</span>
          </div>
        </Fade>
      </Container>
    </section>
  );
}

function WhatWeBuild() {
  const items = [
    { name: 'Custom Software', url: '/studio', accent: C.studio, desc: 'Web apps, SaaS, portals — idea to launch in 2–6 weeks.' },
    { name: 'AI Agents', url: '/agents', accent: C.agents, desc: 'Purpose-built agents for reports, email, data entry, support. From $199/mo.', featured: true, sub: { l: 'Browse catalog', u: '/agents/catalog' } },
    { name: 'Internal Tools', url: '/studio/services/internal-tools', accent: C.studio, desc: 'Dashboards, admin panels, reporting — replacing your spreadsheets.' },
    { name: 'Automation', url: '/studio/services/automation-integration', accent: C.studio, desc: 'Connect tools. Automate workflows. Stop copying data.' },
    { name: 'Rescue & Ship', url: '/studio/services/rescue-ship', accent: C.studio, desc: 'AI prototype stuck? We take over and ship it.' },
    { name: 'Hosting', url: '/cloud', accent: C.cloud, desc: 'Managed servers, databases, SSL, CDN. At cost.' },
    { name: 'Maintenance', url: '/services', accent: C.services, desc: 'Bugs, security, features, monitoring. Same team.' },
  ];
  return (
    <section className="hp-s" style={{ background: 'var(--bg)' }}>
      <Container>
        <Fade>
          <Badge>What We Build</Badge>
          <H2 style={{ maxWidth: 480, marginBottom: 40 }}>
            Whatever your business needs.{' '}
            <span className="grad-text">We&apos;ve built it before.</span>
          </H2>
        </Fade>
        <div className="build-grid">
          {items.map((it, i) => (
            <Fade key={it.name} d={i * 0.05} style={{ display: 'contents' }}>
              <Link href={it.url} style={{ textDecoration: 'none', display: 'contents' }}>
                <Card accent={it.accent} featured={it.featured} style={it.featured ? { gridColumn: 'span 2' } : {}}>
                  {it.featured && <span style={{ ...monoTag, display: 'inline-block', padding: '2px 8px', background: `${it.accent}15`, border: `1px solid ${it.accent}30`, borderRadius: 100, color: it.accent, marginBottom: 10 }}>Featured</span>}
                  <h3 style={{ ...cardTitle, fontSize: it.featured ? '1.2rem' : '1.05rem' }}>{it.name}</h3>
                  <p style={cardBody}>{it.desc}</p>
                  {'sub' in it && it.sub && <span style={{ ...cardBody, color: it.accent, display: 'block', marginTop: 10, fontSize: '0.82rem' }}>{it.sub.l} →</span>}
                  <div style={{ ...monoTag, color: it.accent, marginTop: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 10, height: 1, background: it.accent }} aria-hidden="true" />
                    {it.url.split('/')[1]}
                  </div>
                </Card>
              </Link>
            </Fade>
          ))}
        </div>
        <Fade d={0.2}>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Button href="/contact" variant="ghost" size="md">Not sure? Let&apos;s talk</Button>
          </div>
        </Fade>
      </Container>
    </section>
  );
}

function Numbers() {
  const rows = [
    { l: 'Timeline', a: '3–6 mo', f: '2–4 mo', h: 'Ongoing', s: '2–6 weeks' },
    { l: 'Cost', a: '$50K–200K', f: '$10K–40K', h: '$80K–150K/yr', s: '$3K–20K' },
    { l: 'After launch', a: 'New contract', f: 'Hope they respond', h: 'You manage', s: 'Same team' },
    { l: 'AI-powered', a: 'Rarely', f: 'Sometimes', h: 'Depends', s: 'Every project' },
    { l: 'Code ownership', a: 'Sometimes', f: 'Usually', h: 'Yes', s: 'Always — 100%' },
  ];
  return (
    <section className="hp-s hp-alt">
      <Container>
        <Fade>
          <Badge>The Math</Badge>
          <H2 style={{ maxWidth: 480, marginBottom: 36 }}>Speed, quality, and ongoing support — <span className="grad-text">the math works differently.</span></H2>
        </Fade>
        <Fade>
          <div style={{ overflowX: 'auto', borderRadius: 14, border: '1px solid var(--border)' }}>
            <table className="cmp-table">
              <thead><tr style={{ background: 'var(--bg-card)' }}><th>Criteria</th><th>Agency</th><th>Freelancer</th><th>In-House</th><th className="cmp-sf">SocioFi</th></tr></thead>
              <tbody>{rows.map((r, i) => (
                <tr key={r.l} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--bg-card)' }}>
                  <td>{r.l}</td><td>{r.a}</td><td>{r.f}</td><td>{r.h}</td><td className="cmp-sf">{r.s}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </Fade>
      </Container>
    </section>
  );
}

function Products() {
  const items = [
    { name: 'FabricxAI', url: '/products/fabricxai', sub: '22 agents', desc: 'Manufacturing intelligence. Quality control, supply chain, analytics.' },
    { name: 'NEXUS ARIA', url: '/products/nexus-aria', sub: '12 agents', desc: 'Enterprise data analysis. Role-personalized reports, anomaly detection.' },
    { name: 'DevBridge OS', url: '/products/devbridge', sub: 'Internal', desc: 'Our dev platform. Why we deliver in weeks. Coming soon externally.' },
  ];
  return (
    <section className="hp-s" style={{ background: 'var(--bg)' }}>
      <Container>
        <Fade>
          <Badge color={C.products}>Our Products</Badge>
          <H2 style={{ maxWidth: 560, marginBottom: 36 }}>
            We run our own platforms in production.{' '}
            <span style={{ color: C.products }}>Every day.</span>
          </H2>
        </Fade>
        <div className="g3" style={{ marginBottom: 36 }}>
          {items.map((p, i) => (
            <Fade key={p.name} d={i * 0.08}>
              <Link href={p.url} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                <Card accent={C.products} style={{ height: '100%' }}>
                  <div style={{ ...monoTag, color: C.products, marginBottom: 10 }}>{p.sub}</div>
                  <h3 style={cardTitle}>{p.name}</h3>
                  <p style={cardBody}>{p.desc}</p>
                </Card>
              </Link>
            </Fade>
          ))}
        </div>
        <Fade>
          <div style={{ display: 'flex', gap: 36, padding: '24px 32px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            {[{ n: '45+', l: 'Agents' }, { n: '3', l: 'Platforms' }].map(m => (
              <div key={m.l} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-headline)', fontSize: '1.6rem', fontWeight: 600, color: C.products }}>{m.n}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>{m.l}</div>
              </div>
            ))}
            <Button href="/products" variant="ghost" size="sm" accentColor={C.products}>View all</Button>
          </div>
        </Fade>
      </Container>
    </section>
  );
}

function Divisions() {
  const divs = [
    { name: 'Studio', url: '/studio', accent: C.studio, desc: 'Custom software, idea to production.' },
    { name: 'Agents', url: '/agents', accent: C.agents, desc: 'AI agents for your workflows.' },
    { name: 'Services', url: '/services', accent: C.services, desc: 'Maintenance, monitoring, support.' },
    { name: 'Cloud', url: '/cloud', accent: C.cloud, desc: 'Managed hosting and infrastructure.' },
    { name: 'Labs', url: '/labs', accent: C.labs, desc: 'Research and open source.' },
    { name: 'Products', url: '/products', accent: C.products, desc: 'Our own platforms.' },
    { name: 'Academy', url: '/academy', accent: C.academy, desc: 'Courses and workshops.' },
    { name: 'Ventures', url: '/ventures', accent: C.ventures, desc: 'Co-build for equity.' },
  ];
  return (
    <section className="hp-s hp-alt">
      <Container>
        <Fade>
          <Badge>Eight Divisions</Badge>
          <H2 style={{ maxWidth: 560, marginBottom: 36 }}>
            Build, run, and scale —{' '}
            <span className="grad-text">under one roof.</span>
          </H2>
        </Fade>
        <div className="g4" style={{ marginBottom: 32 }}>
          {divs.map((d, i) => (
            <Fade key={d.name} d={i * 0.04}>
              <Link href={d.url} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                <Card accent={d.accent} style={{ height: '100%', padding: '22px 24px' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: `${d.accent}18`, border: `1px solid ${d.accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                    <span style={{ fontFamily: 'var(--font-headline)', fontSize: '0.75rem', fontWeight: 600, color: d.accent }}>{d.name[0]}</span>
                  </div>
                  <h3 style={{ ...cardTitle, fontSize: '0.95rem', marginBottom: 4 }}>{d.name}</h3>
                  <p style={{ ...cardBody, fontSize: '0.82rem' }}>{d.desc}</p>
                </Card>
              </Link>
            </Fade>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Trust() {
  const items = [
    'You own 100% of everything we build.',
    'No jargon — updates written for humans.',
    'Fixed pricing. No surprises.',
    'Honest about what AI can\'t do.',
    'Same team builds and maintains.',
    '3 platforms, 45+ agents in production.',
  ];
  return (
    <section className="hp-s-sm" style={{ background: 'var(--bg)' }}>
      <Container>
        <Fade>
          <Badge>Why Us</Badge>
          <div className="g3">
            {items.map((t, i) => (
              <div key={i} style={{ padding: '20px 24px', background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14 }}>
                <p style={{ ...cardBody, color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.9rem' }}>{t}</p>
              </div>
            ))}
          </div>
        </Fade>
      </Container>
    </section>
  );
}

function CTA() {
  return (
    <section className="hp-s" style={{ background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 50%, color-mix(in srgb, var(--navy) 12%, transparent), transparent)', pointerEvents: 'none' }} />
      <Container narrow style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <Fade>
          <H2 style={{ marginBottom: 16, fontSize: 'clamp(2rem, 3.5vw, 2.8rem)' }}>
            Let&apos;s talk about{' '}
            <span className="grad-text">what you&apos;re building.</span>
          </H2>
          <P style={{ maxWidth: 440, marginInline: 'auto', marginBottom: 32 }}>
            30-minute call. Honest assessment. No pitch deck, no pressure.
          </P>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
            <Button href="/contact" variant="primary" size="lg">Book a Free Call</Button>
            <Button href="/contact#form" variant="ghost" size="lg">Send a Message</Button>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 32 }}>
            We respond within 4 hours. Confidential.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { l: 'Build software', u: '/studio/start-project', c: C.studio },
              { l: 'Deploy agents', u: '/agents', c: C.agents },
              { l: 'Get maintenance', u: '/services/get-protected', c: C.services },
              { l: 'Host with us', u: '/cloud/get-hosted', c: C.cloud },
            ].map(r => <Link key={r.l} href={r.u} className="pill" style={{ borderColor: r.c + '40', color: r.c }}>{r.l}</Link>)}
          </div>
        </Fade>
      </Container>
    </section>
  );
}

/* ─── Export ───────────────────────────────────────────────────────────── */

export default function HomePageClient() {
  return (
    <>
      <style>{STYLES}</style>
      <Hero />
      <Problem />
      <Solution />
      <Process />
      <WhatWeBuild />
      <Numbers />
      <Products />
      <Divisions />
      <Trust />
      <CTA />
    </>
  );
}
