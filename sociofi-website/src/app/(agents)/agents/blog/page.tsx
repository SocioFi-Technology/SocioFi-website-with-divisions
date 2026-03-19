'use client';
import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

const A = '#8B5CF6';
const F = {
  h: "var(--font-manrope,'Manrope'),sans-serif",
  b: "var(--font-dm-sans,'DM Sans'),sans-serif",
  m: "var(--font-jb-mono,'JetBrains Mono'),monospace",
};


const ICONS: Record<string, React.ReactElement> = {
  cpu:        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>,
  dollarSign: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  mail:       <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  zap:        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  tool:       <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  lock:       <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
};
const STYLES = `
  .bl-hero { padding:140px 0 72px; background:radial-gradient(ellipse 70% 50% at 50% 0%,rgba(139,92,246,0.07) 0%,transparent 70%); }
  .bl-container { max-width:1200px; margin:0 auto; padding:0 32px; }
  .bl-label { font-family:${F.m}; font-size:0.72rem; font-weight:500; color:${A}; text-transform:uppercase; letter-spacing:0.12em; margin-bottom:14px; display:flex; align-items:center; gap:10px; }
  .bl-label::before { content:''; width:20px; height:1.5px; background:${A}; display:inline-block; }
  .bl-h1 { font-family:${F.h}; font-size:clamp(1.9rem,3.5vw,2.8rem); font-weight:800; line-height:1.1; letter-spacing:-0.025em; color:var(--text-primary); margin:0 0 14px; }
  .bl-sub { font-family:${F.b}; font-size:1.05rem; line-height:1.7; color:var(--text-secondary); max-width:540px; }
  .bl-section { padding:80px 0; }
  .bl-bg-alt { background:var(--bg-2); }
  .bl-h2 { font-family:${F.h}; font-size:clamp(1.5rem,2.5vw,2rem); font-weight:700; color:var(--text-primary); margin:0 0 8px; letter-spacing:-0.02em; }
  .bl-body { font-family:${F.b}; font-size:0.95rem; color:var(--text-secondary); line-height:1.7; }
  .bl-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
  @media(max-width:1024px) { .bl-grid { grid-template-columns:1fr 1fr; } }
  @media(max-width:600px) { .bl-grid { grid-template-columns:1fr; } }
  .bl-card { background:var(--bg-card); border:1px solid var(--border); border-radius:16px; overflow:hidden; display:flex; flex-direction:column; transition:transform 0.3s,border-color 0.3s; position:relative; }
  .bl-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,${A},#C4B5FD); opacity:0; transition:opacity 0.3s; }
  .bl-card:hover { transform:translateY(-4px); border-color:rgba(139,92,246,0.3); }
  .bl-card:hover::before { opacity:1; }
  .bl-card-img { height:120px; background:linear-gradient(135deg,rgba(139,92,246,0.15) 0%,rgba(139,92,246,0.05) 100%); display:flex; align-items:center; justify-content:center; color:#8B5CF6; }
  .bl-card-body { padding:24px; flex:1; display:flex; flex-direction:column; }
  .bl-card-cat { font-family:${F.m}; font-size:0.66rem; color:${A}; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:8px; }
  .bl-card-title { font-family:${F.h}; font-size:1rem; font-weight:700; color:var(--text-primary); margin-bottom:8px; line-height:1.3; }
  .bl-card-desc { font-family:${F.b}; font-size:0.84rem; color:var(--text-secondary); line-height:1.6; flex:1; margin-bottom:16px; }
  .bl-card-meta { display:flex; align-items:center; justify-content:space-between; margin-top:auto; }
  .bl-card-date { font-family:${F.m}; font-size:0.66rem; color:var(--text-muted); }
  .bl-card-link { font-family:${F.h}; font-size:0.8rem; font-weight:600; color:${A}; text-decoration:none; }
  .bl-card-link:hover { text-decoration:underline; }
  .bl-newsletter { background:var(--bg-card); border:1px solid rgba(139,92,246,0.25); border-radius:16px; padding:40px; display:flex; align-items:center; gap:40px; flex-wrap:wrap; }
  .bl-newsletter-text { flex:1; min-width:240px; }
  .bl-newsletter-title { font-family:${F.h}; font-size:1.1rem; font-weight:700; color:var(--text-primary); margin-bottom:6px; }
  .bl-newsletter-desc { font-family:${F.b}; font-size:0.88rem; color:var(--text-secondary); line-height:1.6; }
  .bl-newsletter-form { display:flex; gap:10px; flex-wrap:wrap; }
  .bl-newsletter-input { padding:11px 16px; border-radius:8px; border:1.5px solid var(--border); background:var(--bg); color:var(--text-primary); font-family:${F.b}; font-size:0.88rem; outline:none; width:240px; transition:border-color 0.2s; }
  .bl-newsletter-input:focus { border-color:${A}; }
  .bl-newsletter-btn { padding:11px 20px; border-radius:8px; background:linear-gradient(135deg,${A} 0%,#7C3AED 100%); color:#fff; font-family:${F.h}; font-size:0.88rem; font-weight:600; border:none; cursor:pointer; white-space:nowrap; }
  .bl-btn-ghost { display:inline-flex; align-items:center; gap:8px; padding:14px 28px; border-radius:10px; border:1.5px solid var(--border); color:var(--text-primary); font-family:${F.h}; font-size:0.9rem; font-weight:600; text-decoration:none; }
  .bl-btn-ghost:hover { border-color:${A}; color:${A}; }
  .bl-btn-pri { display:inline-flex; align-items:center; gap:8px; padding:14px 28px; border-radius:10px; background:linear-gradient(135deg,${A} 0%,#7C3AED 100%); color:#fff; font-family:${F.h}; font-size:0.9rem; font-weight:600; text-decoration:none; }
  .bl-thanks { font-family:${F.b}; font-size:0.88rem; color:${A}; }
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

const ARTICLES = [
  { slug: 'what-is-an-ai-agent', icon: 'cpu', cat: 'Explainer', title: 'What is an AI Agent? (And how is it different from automation?)', desc: 'A plain-English explanation of what agents actually do, how they reason, and why the difference from automation matters for real business workflows.', date: 'March 2026', readTime: '6 min' },
  { slug: 'agent-roi-calculator', icon: 'dollarSign', cat: 'Guide', title: 'How to calculate ROI before deploying an agent', desc: 'A practical framework for estimating how much time and money an agent will save before you commit. Includes a step-by-step worksheet.', date: 'March 2026', readTime: '8 min' },
  { slug: 'email-triage-guide', icon: 'mail', cat: 'Use Case', title: 'Inbox zero for your team\'s shared inbox — with an AI agent', desc: 'How three teams reduced shared inbox response time from 6 hours to under 20 minutes using the Email Triage Agent.', date: 'Feb 2026', readTime: '5 min' },
  { slug: 'agents-vs-automation', icon: 'zap', cat: 'Comparison', title: 'AI Agents vs. Zapier: which one does your business need?', desc: 'An honest comparison of when agents outperform automation tools — and when you should stick with Zapier.', date: 'Feb 2026', readTime: '7 min' },
  { slug: 'custom-agent-guide', icon: 'tool', cat: 'Guide', title: 'When to build a custom agent (vs. use a catalog agent)', desc: 'How to decide whether your workflow fits a pre-built agent or needs something purpose-built. Decision framework included.', date: 'Jan 2026', readTime: '6 min' },
  { slug: 'agent-security', icon: 'lock', cat: 'Technical', title: 'How we secure agent data — and what you should ask any vendor', desc: 'A detailed look at the security architecture behind SocioFi agents, plus 12 questions to ask any AI agent provider before connecting your business data.', date: 'Jan 2026', readTime: '9 min' },
];

export default function BlogPage() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  return (
    <>
      <style>{STYLES}</style>

      <section className="bl-hero">
        <div className="bl-container">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="bl-label">Agent Insights</div>
          </motion.div>
          <motion.h1 className="bl-h1" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            Agent Insights &amp; Use Cases
          </motion.h1>
          <motion.p className="bl-sub" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            Practical guides, honest comparisons, and real use case walkthroughs for business owners deploying AI agents for the first time.
          </motion.p>
        </div>
      </section>

      <section className="bl-section">
        <div className="bl-container">
          <Reveal>
            <div className="bl-label">Latest Articles</div>
            <h2 className="bl-h2" style={{ marginBottom: 8 }}>Practical, no-hype content</h2>
            <p className="bl-body" style={{ marginBottom: 40, maxWidth: 480 }}>We write for business owners who are figuring out how to deploy AI agents — not for AI researchers.</p>
          </Reveal>
          <div className="bl-grid">
            {ARTICLES.map((article, i) => (
              <Reveal key={article.slug} delay={i * 0.08}>
                <div className="bl-card">
                  <div className="bl-card-img">{ICONS[article.icon]}</div>
                  <div className="bl-card-body">
                    <div className="bl-card-cat">{article.cat}</div>
                    <div className="bl-card-title">{article.title}</div>
                    <div className="bl-card-desc">{article.desc}</div>
                    <div className="bl-card-meta">
                      <div className="bl-card-date">{article.date} · {article.readTime}</div>
                      <Link href={`/agents/blog/${article.slug}`} className="bl-card-link">Read →</Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bl-section bl-bg-alt">
        <div className="bl-container">
          <Reveal>
            <div className="bl-newsletter">
              <div className="bl-newsletter-text">
                <div className="bl-newsletter-title">Get new articles in your inbox</div>
                <div className="bl-newsletter-desc">One article per week. No fluff. Unsubscribe anytime.</div>
              </div>
              {!subscribed ? (
                <div className="bl-newsletter-form">
                  <input
                    className="bl-newsletter-input"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                  <button
                    className="bl-newsletter-btn"
                    onClick={() => { if (email) setSubscribed(true); }}
                  >
                    Subscribe
                  </button>
                </div>
              ) : (
                <div className="bl-thanks">You&apos;re subscribed. First article coming soon.</div>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bl-section" style={{ textAlign: 'center' }}>
        <div className="bl-container">
          <Reveal>
            <h2 className="bl-h2" style={{ marginBottom: 12 }}>Ready to go beyond reading?</h2>
            <p className="bl-body" style={{ maxWidth: 400, margin: '0 auto 28px' }}>Deploy your first agent and experience it directly. Setup takes 3–7 business days.</p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/agents/catalog" className="bl-btn-pri">Browse the Catalog →</Link>
              <Link href="/agents/how-it-works" className="bl-btn-ghost">How It Works</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
