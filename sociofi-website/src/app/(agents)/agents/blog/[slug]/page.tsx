'use client';
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';

const A = '#8B5CF6';
const F = {
  h: "var(--font-manrope,'Manrope'),sans-serif",
  b: "var(--font-dm-sans,'DM Sans'),sans-serif",
  m: "var(--font-jb-mono,'JetBrains Mono'),monospace",
};

const STYLES = `
  .bp-container { max-width:760px; margin:0 auto; padding:0 32px; }
  .bp-hero { padding:140px 0 56px; }
  .bp-back { display:inline-flex; align-items:center; gap:6px; font-family:${F.h}; font-size:0.82rem; font-weight:600; color:var(--text-muted); text-decoration:none; margin-bottom:32px; transition:color 0.2s; }
  .bp-back:hover { color:${A}; }
  .bp-cat { font-family:${F.m}; font-size:0.68rem; color:${A}; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:12px; }
  .bp-h1 { font-family:${F.h}; font-size:clamp(1.8rem,3.5vw,2.4rem); font-weight:800; line-height:1.1; letter-spacing:-0.025em; color:var(--text-primary); margin:0 0 20px; }
  .bp-meta { display:flex; align-items:center; gap:16px; flex-wrap:wrap; margin-bottom:40px; }
  .bp-meta-item { font-family:${F.m}; font-size:0.72rem; color:var(--text-muted); }
  .bp-divider { width:40px; height:2px; background:${A}; opacity:0.4; border-radius:1px; }
  .bp-article { padding-bottom:80px; }
  .bp-article h2 { font-family:${F.h}; font-size:1.25rem; font-weight:700; color:var(--text-primary); margin:40px 0 12px; letter-spacing:-0.015em; }
  .bp-article h3 { font-family:${F.h}; font-size:1rem; font-weight:700; color:var(--text-primary); margin:28px 0 10px; }
  .bp-article p { font-family:${F.b}; font-size:0.95rem; line-height:1.8; color:var(--text-secondary); margin:0 0 18px; }
  .bp-article ul { list-style:none; padding:0; margin:0 0 20px; display:flex; flex-direction:column; gap:10px; }
  .bp-article ul li { font-family:${F.b}; font-size:0.92rem; line-height:1.65; color:var(--text-secondary); display:flex; align-items:flex-start; gap:10px; }
  .bp-article ul li::before { content:'→'; color:${A}; flex-shrink:0; font-weight:700; margin-top:1px; }
  .bp-article blockquote { border-left:3px solid ${A}; padding:16px 20px; background:rgba(139,92,246,0.04); border-radius:0 10px 10px 0; margin:24px 0; }
  .bp-article blockquote p { font-family:${F.h}; font-size:0.95rem; font-style:italic; color:var(--text-primary); margin:0; }
  .bp-article .callout { background:var(--bg-card); border:1px solid rgba(139,92,246,0.2); border-radius:12px; padding:20px 24px; margin:24px 0; }
  .bp-article .callout p { margin:0; color:var(--text-secondary); }
  .bp-related { border-top:1px solid var(--border); padding-top:48px; padding-bottom:80px; }
  .bp-related-title { font-family:${F.h}; font-size:1rem; font-weight:700; color:var(--text-primary); margin-bottom:20px; }
  .bp-related-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
  @media(max-width:600px) { .bp-related-grid { grid-template-columns:1fr; } }
  .bp-related-card { background:var(--bg-card); border:1px solid var(--border); border-radius:12px; padding:20px; text-decoration:none; display:block; transition:border-color 0.2s; }
  .bp-related-card:hover { border-color:rgba(139,92,246,0.3); }
  .bp-related-cat { font-family:${F.m}; font-size:0.64rem; color:${A}; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:6px; }
  .bp-related-name { font-family:${F.h}; font-size:0.88rem; font-weight:700; color:var(--text-primary); line-height:1.3; }
  .bp-cta { background:linear-gradient(135deg,rgba(139,92,246,0.08) 0%,rgba(139,92,246,0.03) 100%); border:1px solid rgba(139,92,246,0.2); border-radius:16px; padding:32px 36px; margin:0 0 60px; text-align:center; }
  .bp-cta-title { font-family:${F.h}; font-size:1.05rem; font-weight:700; color:var(--text-primary); margin-bottom:8px; }
  .bp-cta-sub { font-family:${F.b}; font-size:0.88rem; color:var(--text-secondary); margin-bottom:20px; }
  .bp-btn-pri { display:inline-flex; align-items:center; gap:8px; padding:12px 24px; border-radius:10px; background:linear-gradient(135deg,${A} 0%,#7C3AED 100%); color:#fff; font-family:${F.h}; font-size:0.88rem; font-weight:600; text-decoration:none; }
`;

const ARTICLES: Record<string, {
  cat: string;
  title: string;
  date: string;
  readTime: string;
  author: string;
  content: React.ReactNode;
  related: { slug: string; cat: string; title: string }[];
}> = {
  'what-is-an-ai-agent': {
    cat: 'Explainer',
    title: "What is an AI Agent? (And how is it different from automation?)",
    date: 'March 2026',
    readTime: '6 min read',
    author: 'Kamrul Hasan, CTO',
    related: [
      { slug: 'agents-vs-automation', cat: 'Comparison', title: 'AI Agents vs. Zapier: which one does your business need?' },
      { slug: 'agent-roi-calculator', cat: 'Guide', title: 'How to calculate ROI before deploying an agent' },
    ],
    content: (
      <div className="bp-article">
        <h2>The short answer</h2>
        <p>An AI agent is software that can <em>understand a task, reason about how to complete it, take action, and verify the result</em> — not just execute a fixed script. That last part is what makes it different from the automation tools you&apos;ve probably already used.</p>

        <h2>What makes something "automation"?</h2>
        <p>Traditional automation (Zapier, Make, custom scripts) follows rules. When X happens, do Y. If the data looks exactly like you configured it to look, the automation works perfectly. If it doesn&apos;t — if a vendor sends an invoice with different column names, if a customer writes a support email in Spanish, if a new field appears in your CRM — the automation either fails silently or errors out.</p>
        <p>This isn&apos;t a criticism of automation tools. They&apos;re excellent for simple, fully deterministic workflows where the inputs are always the same. But most real business tasks aren&apos;t like that.</p>

        <h2>What makes something an "agent"?</h2>
        <p>An agent understands the <em>intent</em> of a task, not just its format. It can:</p>
        <ul>
          <li>Read an email and understand that the customer is angry, asking about a delayed order, and needs an urgent response — not just that the email contains the word "order"</li>
          <li>Look at a messy spreadsheet from a vendor with inconsistent formatting and correctly extract the data anyway</li>
          <li>Decide that a support ticket is unusually high-priority based on the customer&apos;s language and history, even though it doesn&apos;t match any pre-configured "high-priority" rule</li>
          <li>Generate a report summary that highlights the three most important trend changes — not just attach the spreadsheet</li>
        </ul>

        <h2>The lifecycle of an agent task</h2>
        <p>Every time an agent handles a task, it follows a loop:</p>
        <ul>
          <li><strong>Receive</strong> — an input arrives (email, trigger, scheduled run)</li>
          <li><strong>Reason</strong> — it understands the context and figures out what to do</li>
          <li><strong>Act</strong> — it takes action (queries data, sends a message, updates a record)</li>
          <li><strong>Verify</strong> — it checks whether the action achieved the intended result</li>
          <li><strong>Deliver</strong> — it delivers the output and logs the full audit trail</li>
        </ul>

        <blockquote><p>An agent is a capable, reliable junior employee who can handle defined tasks with judgment — not a replacement for your best people, and not a rigid script.</p></blockquote>

        <h2>When should you use an agent vs. automation?</h2>
        <p>Use automation when: the task is fully deterministic, inputs never vary, and there&apos;s no need for interpretation. Use an agent when: inputs vary, judgment is required, exceptions need to be handled intelligently, or you want the task to get better over time.</p>

        <div className="callout"><p>Most businesses benefit from both: automation for the simplest, most predictable tasks, and agents for everything that requires even a little flexibility or judgment.</p></div>
      </div>
    ),
  },
  'agents-vs-automation': {
    cat: 'Comparison',
    title: "AI Agents vs. Zapier: which one does your business need?",
    date: 'February 2026',
    readTime: '7 min read',
    author: 'Kamrul Hasan, CTO',
    related: [
      { slug: 'what-is-an-ai-agent', cat: 'Explainer', title: 'What is an AI Agent? (And how is it different from automation?)' },
      { slug: 'custom-agent-guide', cat: 'Guide', title: 'When to build a custom agent (vs. use a catalog agent)' },
    ],
    content: (
      <div className="bp-article">
        <h2>Both have their place</h2>
        <p>Zapier and Make are excellent tools. They&apos;re fast to set up, reliable for simple workflows, and affordable. If your process looks like &ldquo;when a new row is added to this spreadsheet, post a Slack message,&rdquo; use Zapier. There&apos;s no reason to use an agent for that.</p>
        <p>But there are specific categories of work where automation consistently breaks down — and where agents consistently deliver. Understanding the difference saves you from deploying the wrong tool.</p>

        <h2>Where automation wins</h2>
        <ul>
          <li>Triggering notifications when a database row changes</li>
          <li>Moving files between cloud storage folders on a schedule</li>
          <li>Syncing form submissions to a spreadsheet</li>
          <li>Simple conditional routing where the rules are always the same</li>
        </ul>

        <h2>Where agents win</h2>
        <ul>
          <li>Reading and understanding incoming emails to route them appropriately</li>
          <li>Reviewing documents for compliance against rules that require interpretation</li>
          <li>Qualifying leads by reasoning about whether they match your ICP</li>
          <li>Handling customer inquiries where the question isn&apos;t in your FAQ</li>
          <li>Generating summaries that extract the <em>most important</em> information, not just copying it</li>
        </ul>

        <blockquote><p>The test: if a smart junior employee could do it in 5 minutes with just the data available, an agent can probably do it. If it requires a completely fixed, pre-programmed script, automation is simpler.</p></blockquote>
      </div>
    ),
  },
};

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : Array.isArray(params.slug) ? params.slug[0] : '';
  const article = ARTICLES[slug];

  if (!article) {
    return (
      <div style={{ padding: '160px 0', textAlign: 'center' }}>
        <style>{STYLES}</style>
        <div style={{ fontFamily: F.h, fontWeight: 800, fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: 12 }}>Article not found</div>
        <Link href="/agents/blog" style={{ color: A, fontFamily: F.h, fontWeight: 600, textDecoration: 'none' }}>Back to blog →</Link>
      </div>
    );
  }

  return (
    <>
      <style>{STYLES}</style>

      <div className="bp-container">
        <section className="bp-hero">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Link href="/agents/blog" className="bp-back">← Agent Blog</Link>
            <div className="bp-cat">{article.cat}</div>
          </motion.div>
          <motion.h1 className="bp-h1" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            {article.title}
          </motion.h1>
          <motion.div className="bp-meta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <span className="bp-meta-item">{article.date}</span>
            <div className="bp-divider" />
            <span className="bp-meta-item">{article.readTime}</span>
            <div className="bp-divider" />
            <span className="bp-meta-item">{article.author}</span>
          </motion.div>
        </section>

        <Reveal>
          {article.content}
        </Reveal>

        <Reveal delay={0.1}>
          <div className="bp-cta">
            <div className="bp-cta-title">Ready to deploy your first agent?</div>
            <div className="bp-cta-sub">Browse 16 pre-built agents. Setup in 3–7 business days.</div>
            <Link href="/agents/catalog" className="bp-btn-pri">Browse the Catalog →</Link>
          </div>
        </Reveal>

        {article.related.length > 0 && (
          <Reveal delay={0.15}>
            <div className="bp-related">
              <div className="bp-related-title">Related articles</div>
              <div className="bp-related-grid">
                {article.related.map(r => (
                  <Link key={r.slug} href={`/agents/blog/${r.slug}`} className="bp-related-card">
                    <div className="bp-related-cat">{r.cat}</div>
                    <div className="bp-related-name">{r.title}</div>
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </>
  );
}
