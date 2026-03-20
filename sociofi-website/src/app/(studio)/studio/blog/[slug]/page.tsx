'use client';
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const A = '#72C4B2';
const F = {
  h: "var(--font-manrope,'Manrope'),sans-serif",
  b: "var(--font-dm-sans,'DM Sans'),sans-serif",
  m: "var(--font-jb-mono,'JetBrains Mono'),monospace",
};

const STYLES = `
  .art-container { max-width:1200px; margin:0 auto; padding:0 32px; }
  .art-label { font-family:${F.m}; font-size:0.72rem; font-weight:500; color:${A}; text-transform:uppercase; letter-spacing:0.12em; margin-bottom:14px; display:flex; align-items:center; gap:10px; }
  .art-label::before { content:''; width:20px; height:1.5px; background:${A}; display:inline-block; }
  .art-hero { padding:120px 0 60px; background:radial-gradient(ellipse 60% 40% at 50% 0%,rgba(114,196,178,0.06) 0%,transparent 70%); }
  .art-badge { font-family:${F.m}; font-size:0.66rem; font-weight:500; padding:4px 12px; border-radius:100px; background:rgba(114,196,178,0.12); color:${A}; text-transform:uppercase; letter-spacing:0.1em; display:inline-block; margin-bottom:16px; }
  .art-h1 { font-family:${F.h}; font-size:clamp(1.8rem,3.5vw,2.6rem); font-weight:800; line-height:1.12; letter-spacing:-0.025em; color:var(--text-primary); margin:0 0 16px; max-width:780px; }
  .art-excerpt { font-family:${F.b}; font-size:1.1rem; line-height:1.7; color:var(--text-secondary); max-width:680px; margin:0 0 24px; }
  .art-meta { display:flex; align-items:center; gap:20px; flex-wrap:wrap; }
  .art-meta-item { font-family:${F.m}; font-size:0.72rem; color:var(--text-muted); letter-spacing:0.04em; display:flex; align-items:center; gap:6px; }
  .art-divider { height:1px; background:var(--border); margin:48px 0; }
  .art-body-wrap { display:grid; grid-template-columns:1fr 280px; gap:60px; align-items:start; }
  @media(max-width:900px) { .art-body-wrap { grid-template-columns:1fr; } }
  .art-prose { max-width:100%; }
  .art-prose p { font-family:${F.b}; font-size:1rem; line-height:1.8; color:var(--text-secondary); margin:0 0 20px; }
  .art-prose h2 { font-family:${F.h}; font-size:1.35rem; font-weight:700; color:var(--text-primary); letter-spacing:-0.015em; margin:36px 0 14px; }
  .art-prose h3 { font-family:${F.h}; font-size:1.1rem; font-weight:600; color:var(--text-primary); margin:28px 0 10px; }
  .art-prose ul { list-style:none; padding:0; margin:0 0 20px; display:flex; flex-direction:column; gap:8px; }
  .art-prose ul li { font-family:${F.b}; font-size:0.95rem; color:var(--text-secondary); display:flex; align-items:flex-start; gap:8px; line-height:1.65; }
  .art-prose ul li::before { content:'·'; color:${A}; font-size:1.1rem; flex-shrink:0; line-height:1.4; }
  .art-prose ol { padding-left:20px; margin:0 0 20px; display:flex; flex-direction:column; gap:8px; }
  .art-prose ol li { font-family:${F.b}; font-size:0.95rem; color:var(--text-secondary); line-height:1.65; }
  .art-prose blockquote { border-left:3px solid ${A}; padding:16px 20px; margin:24px 0; background:rgba(114,196,178,0.05); border-radius:0 8px 8px 0; }
  .art-prose blockquote p { margin:0; font-style:italic; color:var(--text-primary); }
  .art-prose code { font-family:${F.m}; font-size:0.82rem; background:var(--bg-2); padding:2px 6px; border-radius:4px; color:${A}; }
  .art-sidebar { position:sticky; top:100px; }
  .art-sidebar-box { background:var(--bg-card); border:1px solid var(--border); border-radius:14px; padding:24px; margin-bottom:16px; }
  .art-sidebar-title { font-family:${F.h}; font-size:0.88rem; font-weight:700; color:var(--text-primary); margin-bottom:14px; }
  .art-sidebar-link { display:flex; align-items:center; gap:8px; font-family:${F.b}; font-size:0.84rem; color:var(--text-secondary); text-decoration:none; padding:6px 0; border-bottom:1px solid var(--border); transition:color 0.2s; line-height:1.4; }
  .art-sidebar-link:last-child { border-bottom:none; }
  .art-sidebar-link:hover { color:${A}; }
  .art-related { padding:80px 0; background:var(--bg-2); }
  .art-h2 { font-family:${F.h}; font-size:clamp(1.4rem,2.5vw,1.9rem); font-weight:700; color:var(--text-primary); margin:0 0 32px; letter-spacing:-0.02em; }
  .art-related-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
  @media(max-width:768px) { .art-related-grid { grid-template-columns:1fr; } }
  .art-related-card { background:var(--bg-card); border:1px solid var(--border); border-radius:14px; padding:22px; text-decoration:none; display:block; transition:border-color 0.3s,transform 0.3s; }
  .art-related-card:hover { border-color:rgba(114,196,178,0.25); transform:translateY(-3px); }
  .art-related-cat { font-family:${F.m}; font-size:0.64rem; color:${A}; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:8px; }
  .art-related-title { font-family:${F.h}; font-size:0.92rem; font-weight:700; color:var(--text-primary); line-height:1.3; margin-bottom:8px; }
  .art-related-meta { font-family:${F.m}; font-size:0.68rem; color:var(--text-muted); }
  .art-cta { padding:80px 0; text-align:center; }
  .art-cta-box { background:var(--bg-card); border:1px solid var(--border); border-radius:18px; padding:48px; max-width:600px; margin:0 auto; }
  .art-cta-title { font-family:${F.h}; font-size:1.5rem; font-weight:700; color:var(--text-primary); letter-spacing:-0.015em; margin:0 0 10px; }
  .art-cta-body { font-family:${F.b}; font-size:0.95rem; color:var(--text-secondary); line-height:1.7; margin:0 0 24px; }
  .art-btn-pri { display:inline-flex; align-items:center; gap:8px; padding:14px 28px; border-radius:10px; background:linear-gradient(135deg,#3A589E 0%,${A} 100%); color:#fff; font-family:${F.h}; font-size:0.9rem; font-weight:600; text-decoration:none; transition:transform 0.2s,box-shadow 0.2s; }
  .art-btn-pri:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(58,88,158,0.35); }
  .art-btn-ghost { display:inline-flex; align-items:center; gap:8px; padding:14px 28px; border-radius:10px; border:1.5px solid var(--border); color:var(--text-primary); font-family:${F.h}; font-size:0.9rem; font-weight:600; text-decoration:none; transition:border-color 0.2s,color 0.2s; }
  .art-btn-ghost:hover { border-color:${A}; color:${A}; }
  .art-back { display:inline-flex; align-items:center; gap:6px; font-family:${F.b}; font-size:0.84rem; color:var(--text-secondary); text-decoration:none; margin-bottom:32px; transition:color 0.2s; }
  .art-back:hover { color:${A}; }
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

type Category = 'Build Logs' | 'AI & Code' | 'Guides' | 'Case Studies';

interface PostData {
  slug: string;
  title: string;
  excerpt: string;
  category: Category;
  date: string;
  readTime: string;
  author: string;
  body: React.ReactNode;
}

const POST_DATA: PostData[] = [
  {
    slug: 'how-we-rescued-a-broken-saas-mvp-in-18-days',
    title: 'How We Rescued a Broken SaaS MVP in 18 Days',
    excerpt: "A deep dive into the InboxFlow project: what was broken, how we fixed it, and what every founder should know before their first deploy.",
    category: 'Build Logs',
    date: 'March 10, 2026',
    readTime: '8 min',
    author: 'Arifur Rahman',
    body: (
      <>
        <p>
          Priya came to us on a Tuesday. She had a SaaS product she&apos;d been building for three months — a tool for managing email workflows for small teams. It had paying customers. It had a waitlist. It had a demo that worked.
        </p>
        <p>
          It also had a database that was leaking connections, an authentication system that would silently fail for users in certain timezones, and a deployment setup that required someone to manually SSH into a VPS and restart the process every few days.
        </p>
        <p>
          She&apos;d built most of it with AI coding tools. The tools had done an impressive job. The core functionality was there. The UI was clean. The data model was reasonable. But the 20% that makes the difference between a prototype and a product — error handling, background job reliability, session management, monitoring — those pieces were missing or broken.
        </p>

        <h2>The Audit</h2>
        <p>
          Before touching any code, we spent two days doing a structured audit. We looked at five areas:
        </p>
        <ul>
          <li>Authentication and session management — who can log in, how sessions expire, what happens on token refresh</li>
          <li>Database connection management — how connections are opened, pooled, and closed</li>
          <li>Error handling and observability — what happens when something breaks, who knows about it</li>
          <li>Background jobs and reliability — async tasks, queue management, retry logic</li>
          <li>Deployment and infrastructure — how the app runs in production, how updates get deployed</li>
        </ul>
        <p>
          The audit surfaced 23 issues. Six were critical (would cause data loss or security exposure). Nine were serious (would cause visible breakage for users). Eight were improvements (would meaningfully improve reliability or performance).
        </p>

        <h2>What We Fixed and How</h2>
        <p>
          We prioritized the critical issues first. The timezone auth bug was caused by a common mistake: storing session expiry as a local datetime string without timezone information, then comparing it to UTC on the server. The fix was three lines of code, but finding it required understanding the full session lifecycle.
        </p>
        <p>
          The database connection leak was more involved. The ORM was being instantiated inside an async function that got called on every request, without connection pooling configured. Under load, this exhausted the database&apos;s connection limit and caused cascading failures. We introduced a singleton connection pool and added proper cleanup handlers.
        </p>
        <blockquote>
          <p>
            The code they wrote is cleaner than anything I&apos;d seen from the AI tools I was using. More importantly, they explained every change — I actually understand my own codebase now.
          </p>
        </blockquote>
        <p>
          The deployment setup moved from a manual VPS restart process to a proper containerized deployment on Railway, with automatic deploys from the main branch, environment variable management, and uptime monitoring.
        </p>

        <h2>Day 18</h2>
        <p>
          Eighteen days after the initial call, we handed back a codebase that ran without intervention, had zero critical issues, included structured logging so Priya could see exactly what was happening in production, and had CI/CD set up so deploys happened automatically on merge.
        </p>
        <p>
          She launched to her waitlist the next day. No downtime. No scramble. Six months later, the product is still running on the same infrastructure we set up, maintained by SocioFi Services.
        </p>

        <h2>What Every Founder Should Know</h2>
        <p>
          The mistakes in InboxFlow were not unique to Priya. We see versions of these issues in almost every AI-built codebase we touch. That&apos;s not a criticism — it&apos;s a structural reality. AI tools are trained to make code that works in happy-path scenarios. Error paths, edge cases, and production reliability are underrepresented in the training signal because they&apos;re harder to demonstrate in examples.
        </p>
        <p>
          The practical implication: if you&apos;ve built something with AI tools and it works in development, you probably have 80% of a product. The other 20% is what keeps it working after you ship it.
        </p>
      </>
    ),
  },
  {
    slug: 'ai-writes-70-percent-of-our-code',
    title: 'AI Writes 70% of Our Code. Here\'s What the Other 30% Takes.',
    excerpt: "The honest breakdown of what AI development tools can and can't do — and why the 30% that requires human judgment is the 30% that matters most.",
    category: 'AI & Code',
    date: 'March 3, 2026',
    readTime: '12 min',
    author: 'Kamrul Hasan',
    body: (
      <>
        <p>
          We use AI tools on every project we build. Not experimentally — structurally. They&apos;re part of how we deliver a production-ready web application in 2–3 weeks instead of 2–3 months.
        </p>
        <p>
          But we&apos;re not going to pretend that AI does everything, or that the tooling has reached a point where the human engineer is optional. The reality is more nuanced — and understanding it is actually important for anyone building software in 2026.
        </p>
        <p>
          Let&apos;s start with what AI does exceptionally well, then get honest about where it still falls short.
        </p>

        <h2>The 70%: Where AI Shines</h2>
        <p>
          AI tools are genuinely impressive at generating well-structured code for common patterns. React components, REST API endpoints, database schema migrations, test boilerplate, form validation — these tasks involve known patterns that appear thousands of times in training data, and modern AI tools handle them with accuracy that would have been unthinkable three years ago.
        </p>
        <p>
          On a typical project, we use AI to accelerate:
        </p>
        <ul>
          <li>UI component scaffolding — layout, styling, responsive behavior</li>
          <li>API route generation — CRUD operations, input validation, error responses</li>
          <li>Database query generation for standard operations</li>
          <li>Test case generation for defined input/output pairs</li>
          <li>Documentation generation for functions and modules</li>
          <li>Boilerplate for authentication flows (which we then review carefully)</li>
        </ul>

        <h2>The 30%: Where Humans Still Lead</h2>
        <p>
          Here&apos;s the part that matters. The 30% where AI tools still require careful human judgment is not a collection of minor edge cases. It&apos;s the 30% that determines whether a product is production-ready.
        </p>
        <p>
          Architecture decisions are the clearest example. AI tools will generate code for whatever architecture you describe, but they won&apos;t push back if your architecture is wrong for your use case. We&apos;ve seen AI-generated systems that would work fine at 100 users and collapse at 10,000 — not because the code was wrong, but because the architectural choice was wrong for the scale.
        </p>
        <p>
          Security is another area where AI tools produce plausible-looking code that has subtle vulnerabilities. The most dangerous category: security issues that don&apos;t cause any visible problems during development and only become exploitable under specific conditions in production.
        </p>

        <h2>The Review Protocol</h2>
        <p>
          Every piece of AI-generated code that enters our codebase passes through a senior engineer&apos;s review. This isn&apos;t a cursory glance — it&apos;s a structured review against a checklist that covers security, error handling, performance characteristics, and maintainability.
        </p>
        <p>
          This review step is why we can move fast without compromising quality. The AI handles the surface area; the engineer validates the depth. Neither is sufficient alone. Together, they&apos;re how we ship production-ready code faster than anyone doing it either purely by hand or purely by AI.
        </p>
      </>
    ),
  },
  {
    slug: '5-things-that-break-every-ai-generated-codebase',
    title: 'The 5 Things That Break Every AI-Generated Codebase',
    excerpt: "Auth, payments, deployment, error handling, and security. Here's why AI tools consistently get these wrong and how to spot the problems early.",
    category: 'Guides',
    date: 'February 24, 2026',
    readTime: '10 min',
    author: 'Kamrul Hasan',
    body: (
      <>
        <p>
          After auditing dozens of AI-built codebases, we&apos;ve noticed that the same five categories of issues appear almost every time. Not because AI tools are bad — but because these categories are structurally harder to get right from examples alone.
        </p>
        <p>
          If you&apos;ve built something with AI development tools, here&apos;s what to check before you ship.
        </p>

        <h2>1. Authentication</h2>
        <p>
          The happy path works. The edge cases don&apos;t. Common issues: sessions that don&apos;t expire correctly, token refresh that fails silently, no brute-force protection on login endpoints, password reset flows with timing vulnerabilities.
        </p>
        <p>
          What to look for: what happens when a session expires mid-request? What happens when someone requests 1000 password resets? What happens when the JWT signing key rotates?
        </p>

        <h2>2. Payments</h2>
        <p>
          Stripe&apos;s sandbox works perfectly. Production edge cases do not. Webhook handling is almost always incomplete — successful payment webhooks are handled, but failed payment retry events, subscription cancellations, and chargeback notifications are often ignored.
        </p>
        <p>
          The result: customers who cancel still have access, failed subscriptions still bill, and you have no visibility into payment anomalies.
        </p>

        <h2>3. Deployment</h2>
        <p>
          AI-generated deployment scripts are usually incomplete. Environment variables aren&apos;t validated at startup. Database migrations aren&apos;t automated. Health checks are missing. There&apos;s no graceful shutdown handling. The first deploy works; the tenth breaks in a confusing way.
        </p>

        <h2>4. Error Handling</h2>
        <p>
          Generic try/catch blocks that swallow errors silently. No structured logging. No error reporting to an external service. When something breaks in production, you find out from a user, not a notification.
        </p>

        <h2>5. Security</h2>
        <p>
          The most common: missing rate limiting on public endpoints, CORS configured too broadly, secrets in version control or client-side code, SQL injection vectors in dynamic queries, missing CSRF protection.
        </p>
        <p>
          None of these are exotic. They&apos;re the same issues that show up in AI-generated code because they&apos;re invisible in the happy path but critical in the adversarial path.
        </p>
      </>
    ),
  },
  {
    slug: 'ai-prototype-to-production-in-3-weeks',
    title: 'How to Go From AI Prototype to Production in Under 3 Weeks',
    excerpt: "A practical framework for founders who've built something with AI tools and need to turn it into a real, deployable product.",
    category: 'Guides',
    date: 'February 17, 2026',
    readTime: '6 min',
    author: 'Arifur Rahman',
    body: (
      <>
        <p>
          You built something. It works in development. It demos well. Now you need to ship it — for real users, with real data, and with a reasonable expectation that it won&apos;t break.
        </p>
        <p>
          Here&apos;s the framework we use to take AI-built prototypes to production. You can do parts of this yourself; some parts benefit from a specialized team. We&apos;ll be clear about which is which.
        </p>

        <h2>Week 1: Audit and Architecture</h2>
        <p>
          Before writing new code, understand what you have. Map the data model, document the API surface, identify the third-party dependencies, and flag the areas where the code looks complete but isn&apos;t.
        </p>
        <p>
          The most important question at this stage: what are the five most likely ways this breaks? Answer that before touching a line of code.
        </p>

        <h2>Week 2: Hardening</h2>
        <p>
          Fix what&apos;s broken. This typically means: proper error handling throughout, complete authentication edge cases, payment webhook handling, structured logging, and input validation on every public endpoint. This isn&apos;t glamorous work, but it&apos;s the work that makes production possible.
        </p>

        <h2>Week 3: Deployment and Launch</h2>
        <p>
          Set up production infrastructure, configure automated deployments, add monitoring and alerting, run load testing to verify performance assumptions, and deploy. The last day should be boring — deploy, watch the dashboards, confirm everything is running, launch.
        </p>
        <p>
          The goal is a launch day where nothing surprising happens. Surprises in software are almost always bad surprises.
        </p>
      </>
    ),
  },
  {
    slug: 'building-brightpath-internal-tool-3-weeks',
    title: 'Building BrightPath: A 30-Person Internal Tool in 3 Weeks',
    excerpt: "How we replaced a company's entire operations workflow — 4 spreadsheets, manual data entry, and hours of reporting — with a real-time dashboard.",
    category: 'Build Logs',
    date: 'February 10, 2026',
    readTime: '7 min',
    author: 'Arifur Rahman',
    body: (
      <>
        <p>
          BrightPath Logistics had a problem that most growing businesses recognize: their operations were running on a combination of four spreadsheets, a shared inbox, and a whiteboard. It worked when the team was 10 people. By 30 people, it was a full-time job just to know what was happening.
        </p>
        <p>
          Marcus, the COO, had received quotes from two traditional agencies. Both came back over $80K and quoted 4 months. He found us through a referral. Three weeks and under $10K later, the system was live.
        </p>

        <h2>What We Built</h2>
        <p>
          A real-time operations dashboard with four core modules: shipment tracking (replacing spreadsheet #1 and #2), driver assignment and route management (replacing the whiteboard), customer notification automation (replacing the shared inbox), and an executive reporting module (replacing spreadsheet #3 and #4 plus 3 hours of manual reporting per week).
        </p>

        <h2>Why It Was Possible in 3 Weeks</h2>
        <p>
          Internal tools have a structural advantage over customer-facing products: the user population is small and known. We could talk to every future user before writing code. The requirements were stable because they were replacing known workflows, not inventing new ones. And the tolerance for a slightly rough UX in week one is higher — internal users will adapt faster than customers.
        </p>
        <p>
          We used AI tooling to generate the CRUD operations, the reporting queries, and the UI components. A senior engineer reviewed everything and wrote the real-time sync logic and the notification system by hand — those required architectural decisions that benefited from human judgment about the trade-offs.
        </p>
      </>
    ),
  },
  {
    slug: 'why-we-give-fixed-prices',
    title: 'Why We Give Fixed Prices When Everyone Else Bills Hourly',
    excerpt: "Hourly billing misaligns incentives. Here's why we charge fixed project prices and how we protect ourselves (and clients) when scope grows.",
    category: 'Guides',
    date: 'February 3, 2026',
    readTime: '5 min',
    author: 'Arifur Rahman',
    body: (
      <>
        <p>
          Every agency and most freelancers bill hourly. We don&apos;t. Here&apos;s why, and here&apos;s how we make it work for both sides.
        </p>

        <h2>The Misalignment Problem</h2>
        <p>
          Hourly billing creates a structural misalignment between what the client wants (done fast) and what incentivizes the developer (more hours). A developer who finishes a project in 20 hours earns less than one who takes 30 hours. This isn&apos;t an accusation — it&apos;s an incentive structure that makes it harder to do the right thing.
        </p>
        <p>
          Fixed pricing flips this. Finishing faster doesn&apos;t reduce our income — it lets us take the next project. Our incentive is to be efficient, not to maximize hours. That&apos;s better for clients and, frankly, better for us.
        </p>

        <h2>How We Protect Ourselves</h2>
        <p>
          Fixed pricing only works if scope is controlled. We spend significant time on scoping before any proposal — not because we want to charge for discovery, but because a clear scope is the foundation that makes fixed pricing possible.
        </p>
        <p>
          Our proposals include a clear definition of what&apos;s in scope, what&apos;s explicitly out of scope, and what triggers a change order. When scope grows (it always does, a little), we have an honest conversation about what it takes to add it.
        </p>

        <h2>What You Get</h2>
        <p>
          You know your budget before you start. You don&apos;t get surprised by an invoice that&apos;s twice what you expected. And you have a team whose incentives are aligned with finishing well, not dragging the project out.
        </p>
      </>
    ),
  },
];

const RELATED_SLUGS: Record<string, string[]> = {
  'how-we-rescued-a-broken-saas-mvp-in-18-days': [
    'ai-writes-70-percent-of-our-code',
    '5-things-that-break-every-ai-generated-codebase',
    'ai-prototype-to-production-in-3-weeks',
  ],
  'ai-writes-70-percent-of-our-code': [
    '5-things-that-break-every-ai-generated-codebase',
    'how-we-rescued-a-broken-saas-mvp-in-18-days',
    'ai-prototype-to-production-in-3-weeks',
  ],
  '5-things-that-break-every-ai-generated-codebase': [
    'ai-writes-70-percent-of-our-code',
    'how-we-rescued-a-broken-saas-mvp-in-18-days',
    'ai-prototype-to-production-in-3-weeks',
  ],
  'ai-prototype-to-production-in-3-weeks': [
    'how-we-rescued-a-broken-saas-mvp-in-18-days',
    '5-things-that-break-every-ai-generated-codebase',
    'why-we-give-fixed-prices',
  ],
  'building-brightpath-internal-tool-3-weeks': [
    'how-we-rescued-a-broken-saas-mvp-in-18-days',
    'ai-writes-70-percent-of-our-code',
    'why-we-give-fixed-prices',
  ],
  'why-we-give-fixed-prices': [
    'ai-writes-70-percent-of-our-code',
    'ai-prototype-to-production-in-3-weeks',
    'building-brightpath-internal-tool-3-weeks',
  ],
};

export default function BlogPostPage() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : Array.isArray(params.slug) ? params.slug[0] : '';

  const post = POST_DATA.find(p => p.slug === slug) ?? POST_DATA[0];
  const relatedSlugs = RELATED_SLUGS[post.slug] ?? [];
  const related = relatedSlugs.map(s => POST_DATA.find(p => p.slug === s)).filter(Boolean) as PostData[];

  return (
    <>
      <style>{STYLES}</style>

      {/* Hero / Article Header */}
      <section className="art-hero">
        <div className="art-container">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Link href="/studio/blog" className="art-back">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              All posts
            </Link>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }}>
            <span className="art-badge">{post.category}</span>
          </motion.div>
          <motion.h1 className="art-h1" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            {post.title}
          </motion.h1>
          <motion.p className="art-excerpt" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}>
            {post.excerpt}
          </motion.p>
          <motion.div className="art-meta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.22 }}>
            <span className="art-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              {post.author}
            </span>
            <span className="art-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              {post.date}
            </span>
            <span className="art-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {post.readTime} read
            </span>
          </motion.div>
        </div>
      </section>

      {/* Article Body */}
      <section style={{ padding: '0 0 80px' }}>
        <div className="art-container">
          <div className="art-divider" />
          <div className="art-body-wrap">
            <article className="art-prose">
              {post.body}
            </article>
            <aside className="art-sidebar">
              <div className="art-sidebar-box">
                <div className="art-sidebar-title">More from Studio</div>
                {related.map(r => (
                  <Link key={r.slug} href={`/studio/blog/${r.slug}`} className="art-sidebar-link">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={A} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    {r.title}
                  </Link>
                ))}
              </div>
              <div className="art-sidebar-box">
                <div className="art-sidebar-title">Build with us</div>
                <p style={{ fontFamily: F.b, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.65, margin: '0 0 14px' }}>
                  Ready to take your project from prototype to production?
                </p>
                <Link href="/studio/start-project" className="art-btn-pri" style={{ width: '100%', justifyContent: 'center', fontSize: '0.84rem', padding: '11px 16px' }}>
                  Start a Project
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {related.length > 0 && (
        <section className="art-related">
          <div className="art-container">
            <Reveal>
              <h2 className="art-h2">Related Posts</h2>
              <div className="art-related-grid">
                {related.map((r, i) => (
                  <Reveal key={r.slug} delay={i * 0.08}>
                    <Link href={`/studio/blog/${r.slug}`} className="art-related-card">
                      <div className="art-related-cat">{r.category}</div>
                      <div className="art-related-title">{r.title}</div>
                      <div className="art-related-meta">{r.date} · {r.readTime} read</div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="art-cta">
        <div className="art-container">
          <Reveal>
            <div className="art-cta-box">
              <div className="art-label" style={{ justifyContent: 'center' }}>Next Step</div>
              <h2 className="art-cta-title">Liked this? See what we build.</h2>
              <p className="art-cta-body">
                We write from experience. Every post is from a real project. If you&apos;re building something and want the team behind these posts, let&apos;s talk.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/studio/start-project" className="art-btn-pri">
                  Start a Project
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </Link>
                <Link href="/studio/blog" className="art-btn-ghost">Read More Posts</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
