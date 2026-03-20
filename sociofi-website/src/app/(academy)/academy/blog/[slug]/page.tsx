'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// ── Constants ────────────────────────────────────────────────────────────────
const A = '#E8B84D';
const F = {
  h: "var(--font-manrope,'Manrope'),sans-serif",
  b: "var(--font-dm-sans,'DM Sans'),sans-serif",
  m: "var(--font-jb-mono,'JetBrains Mono'),monospace",
};

// ── Scroll Reveal ────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ── Icons ────────────────────────────────────────────────────────────────────
function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="19" y1="12" x2="5" y2="12"/>
      <polyline points="12 19 5 12 12 5"/>
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}

// ── Articles Data ─────────────────────────────────────────────────────────────
interface Article {
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  authorTitle: string;
  authorInitials: string;
  content: string;
  relatedSlugs: string[];
  relatedCourse: { name: string; slug: string };
}

const ARTICLES: Article[] = [
  {
    slug: '5-things-founders-should-know-before-hiring-dev-team',
    title: '5 Things Every Founder Should Know Before Hiring a Dev Team',
    category: 'AI Development',
    date: 'March 15, 2026',
    readTime: '8 min read',
    author: 'Arifur Rahman',
    authorTitle: 'CEO, SocioFi Technology',
    authorInitials: 'AR',
    relatedSlugs: ['how-to-read-a-technical-proposal-in-10-minutes', '70-30-rule-ai-and-engineers'],
    relatedCourse: { name: 'AI Development for Founders', slug: 'ai-development-for-founders' },
    content: `Most founders hire a dev team before they're ready. Not because they're careless — because nobody told them what "ready" actually means.

After overseeing 80+ software projects at SocioFi, I've seen the same five knowledge gaps create the same problems: blown timelines, budget surprises, and software that doesn't do what anyone thought it would. Here's what you need to understand before you sign anything.

**1. Know what you want before you hire**

This sounds obvious. It isn't. "I want an app that lets people book appointments" is not a product definition — it's a category. The dev team will ask: Who books? How do they pay? What happens when someone cancels? Can the business owner set availability? Do you need reminders? Each of those answers changes the scope, the timeline, and the cost.

Founders who come with a written specification — even a rough one — get dramatically more accurate proposals and dramatically fewer surprises. Your job before hiring is not to design the software. It's to define what problem it solves, who it's for, and what the minimum working version needs to do.

**2. A proposal you can't evaluate is a proposal you can't accept**

The proposal is your contract before the contract. If you can't tell whether it's complete, you can't protect yourself when it isn't. Vague proposals lead to scope disputes. Scope disputes lead to cost overruns. Cost overruns lead to the classic founder frustration: "It was supposed to cost $20K and now they're asking for $40K."

You don't need to understand every technical detail. You do need to understand what's included, what's explicitly excluded, and what the delivery milestones are. If you can't read it confidently, learn to read it before you sign.

**3. AI will write 70% of the code — the engineer handles the 30% that matters**

This is the reality of modern software development, and it changes how you should think about what you're paying for. AI coding tools generate working code fast. What they can't do: architect the system so it doesn't fall apart at scale, debug the 3am production issue, integrate securely with your payment processor, or configure the deployment so it actually stays up.

When you hire a dev team, you're primarily paying for the 30% — the judgment, debugging, architecture, and maintenance. The team that uses AI tools well completes the 70% faster, so more of their energy goes into the 30% that actually makes the difference. Ask potential hires how they use AI tools in their workflow. Vague answers are a yellow flag.

**4. Timelines are negotiated, not discovered**

Timelines in proposals are estimates based on assumptions. The assumptions are often not stated explicitly. Scope changes, unexpected integrations, review cycles, third-party API delays — all of these compress or expand the timeline, and none of them are your fault or the dev team's fault.

What matters is how you handle timeline discussions. Get milestone-based timelines in writing. Agree on what triggers a timeline revision. Understand what "done" means at each milestone before the project starts. A dev team that won't commit to milestones is a team that won't be accountable when things slip.

**5. The cheapest proposal is rarely the best value**

The lower the price, the more likely something is missing. That missing thing will surface later — as a change order, as rushed code that breaks in production, or as a team that disappears when the hard problems appear.

Evaluate proposals on completeness, not price. Does it cover all the functionality you need? Are there clear acceptance criteria? Does the team have experience with your specific type of product? The right team is the one that delivers what you need, on a timeline you can plan around, at a total cost (including the fixes you won't have to pay for) that makes sense for your business.`,
  },
  {
    slug: 'what-ai-agents-actually-are',
    title: 'What AI Agents Actually Are (No Hype, No Jargon)',
    category: 'AI Agents',
    date: 'March 10, 2026',
    readTime: '7 min read',
    author: 'Kamrul Hasan',
    authorTitle: 'CTO, SocioFi Technology',
    authorInitials: 'KH',
    relatedSlugs: ['build-buy-or-agent', '70-30-rule-ai-and-engineers'],
    relatedCourse: { name: 'Understanding AI Agents for Business', slug: 'understanding-ai-agents-for-business' },
    content: `"AI agents" is one of the most overloaded phrases in technology right now. It means everything from a simple customer service chatbot to a fully autonomous software system that manages its own workflows. That range of meaning makes the term nearly useless without context.

Let me give you the actual definition — and more importantly, the practical one.

**What an agent actually is**

An AI agent is software that can take actions in response to inputs, not just produce text responses. The distinction matters more than it sounds. A chatbot reads your question and writes an answer. An agent reads your input and then does something: sends an email, updates a database record, triggers a workflow, calls an external API, schedules a meeting.

The "intelligence" in an AI agent is the ability to decide what action to take and when. A simple agent follows rules: if the customer asks for a refund, look up their order in the database and initiate the refund process. A more sophisticated agent can interpret ambiguous requests, handle exceptions, and chain multiple actions together without human intervention at each step.

**What agents are not**

Agents are not magic. They are not general-purpose problem solvers that you can point at your business and watch optimize everything. Every agent has a defined scope — the things it can do and the data it can access. Outside that scope, it does nothing.

Agents are also not chatbots. A chatbot converses. An agent acts. Many products marketed as "AI agents" are sophisticated chatbots — they understand language well but cannot take any action in the world. If a vendor is calling their product an agent, ask specifically: what actions can it take? What can it connect to? If the answer is "it answers questions very accurately," you're looking at a chatbot.

**Real business use cases**

The agents delivering value in businesses today are narrow and specific. They're not trying to run your whole company. They handle one well-defined workflow.

Customer intake automation: a prospect fills in a form, the agent qualifies them against your criteria, updates your CRM, and either books a calendar slot or routes them to a human rep. A workflow that used to take an hour of admin time takes 2 minutes.

Internal support: employees ask the agent questions about HR policy, expense procedures, or IT setup. The agent searches your internal documentation, provides accurate answers, and escalates to a human when it can't find a clear answer. The same answer gets given consistently, every time.

Data monitoring and alerting: the agent watches a data source — sales figures, server metrics, customer feedback — and takes a predefined action when certain conditions are met. Instead of someone checking a dashboard every morning, the morning check happens automatically.

**What it costs**

This is where agents become genuinely accessible for smaller businesses. A well-scoped agent for a single workflow typically costs less to build and run than hiring the person who currently handles that workflow manually. The ROI calculation is usually straightforward: how many hours does this take per week, and what is an hour of that person's time worth?

The mistake most businesses make is thinking too broadly. They want "an agent that handles everything customer-related." That project is expensive, complex, and likely to underdeliver. The right approach: identify the one workflow that costs the most time or creates the most errors. Build a focused agent for that workflow. Measure the result. Expand from there.

**The question to ask yourself**

Before evaluating any agent solution, answer this: what specific, repeatable workflow are you trying to automate, and what are the inputs and outputs of that workflow? If you can't answer that, you're not ready to buy an agent. If you can answer it clearly, the right solution is probably simpler and cheaper than you think.`,
  },
  {
    slug: 'how-to-read-a-technical-proposal-in-10-minutes',
    title: 'How to Read a Technical Proposal in 10 Minutes',
    category: 'Product Management',
    date: 'March 5, 2026',
    readTime: '6 min read',
    author: 'Arifur Rahman',
    authorTitle: 'CEO, SocioFi Technology',
    authorInitials: 'AR',
    relatedSlugs: ['5-things-founders-should-know-before-hiring-dev-team', 'why-your-product-spec-is-wrong'],
    relatedCourse: { name: 'How to Spec a Software Product', slug: 'how-to-spec-a-software-product' },
    content: `A technical proposal is a sales document written by engineers. That combination — selling, but in engineer language — is exactly why non-technical buyers struggle with it.

Here's a framework for reading any proposal in 10 minutes and knowing whether it's worth taking seriously.

**Minute 1-2: The scope summary**

Every credible proposal includes a plain-language summary of what will be built. Find it first. Read it carefully. Ask yourself: does this match what I asked for? Not "does it mention the things I asked for" but "is what they're describing the same thing I described?"

Proposals frequently interpret requirements creatively. A founder asks for a "user dashboard" and gets a proposal for an "analytics interface." Same thing? Maybe. Maybe not. If the scope summary is vague or uses different language than your requirements, that's a red flag — not because the team is trying to deceive you, but because unclear scope leads to disputes later.

**Minute 3-4: The feature list**

The feature list is the contract in disguise. Go through it item by item and mark anything that's missing from your requirements. Also mark anything you didn't ask for — scope additions that seem reasonable but weren't requested often indicate the team made assumptions about what you need.

The goal isn't to find problems. It's to identify gaps so you can ask about them before signing. "I notice the proposal doesn't include email notifications — is that excluded from scope, or handled another way?" is a great question. It shows you read carefully and gives the team a chance to clarify.

**Minute 5-6: The timeline and milestones**

A good proposal breaks the project into milestones with deliverables at each stage. Each milestone should describe what you'll have at the end of it — not just "Phase 2 complete" but "a working product with user registration, login, and profile creation that you can log into and test."

Proposals without milestones are proposals without accountability. If the timeline is a single delivery date three months from now, you have no mechanism to know whether the project is on track until it isn't. Ask for milestone-based delivery before signing anything.

**Minute 7-8: What's explicitly excluded**

The exclusions section is as important as the feature list. What isn't being built? Common exclusions: third-party integrations (payment processing, email platforms), mobile versions, admin panels, data migration from existing systems, ongoing hosting and maintenance.

None of these are necessarily problems. But if you assumed they were included and they aren't, you'll face unexpected costs and timeline gaps after you've already started.

**Minute 9: The pricing structure**

Is the price fixed or hourly? Fixed-price proposals are more predictable — you know the cost upfront. Hourly proposals carry risk because scope changes and revisions add up. Neither model is inherently better, but you need to understand which one you're agreeing to.

Also check: what's the payment schedule? Are there deposits? What triggers each payment? A reasonable structure is milestone-based payments — you pay when defined deliverables are complete. Avoid any structure that requires full upfront payment.

**Minute 10: Red flags**

A few signals that a proposal deserves extra scrutiny: no portfolio or case studies from similar projects; timeline that seems dramatically shorter than comparable projects; price that's significantly lower than other proposals (something is either excluded or the quality will reflect the price); no named team members or unclear who will actually do the work.

A proposal that passes the 10-minute read confidently is a proposal worth discussing seriously. One that leaves you uncertain after this framework deserves follow-up questions before you move forward — or find a team whose proposals you can read without uncertainty.`,
  },
  {
    slug: '70-30-rule-ai-and-engineers',
    title: 'The 70/30 Rule: How AI and Engineers Actually Split the Work',
    category: 'AI Development',
    date: 'February 28, 2026',
    readTime: '7 min read',
    author: 'Kamrul Hasan',
    authorTitle: 'CTO, SocioFi Technology',
    authorInitials: 'KH',
    relatedSlugs: ['5-things-founders-should-know-before-hiring-dev-team', 'what-ai-agents-actually-are'],
    relatedCourse: { name: 'AI Development for Founders', slug: 'ai-development-for-founders' },
    content: `When clients ask "how much of the code does AI write?" the honest answer is: a lot. Roughly 70% of the code in a modern software project can be generated with AI coding tools. This is real and it's changing how software gets built.

What it doesn't mean is that software development is now 70% cheaper or 70% faster. Here's why.

**What AI generates**

AI coding tools excel at producing code for well-understood, well-specified problems. Standard UI components — forms, tables, navigation menus, dashboards — generated quickly and accurately. CRUD operations (creating, reading, updating, and deleting data records) — database interactions, API endpoints, admin interfaces — AI handles the patterns reliably. Boilerplate: the repetitive structural code every application needs but that no engineer enjoys writing — authentication scaffolding, project configuration, test setup. Integration templates: connecting your app to third-party services like payment processors, email platforms, and analytics tools follows predictable patterns that AI handles well.

For all of this, the quality of what AI generates has become very good. An experienced engineer reviewing AI-generated code for standard components will accept most of it with minor modifications.

**What engineers do**

The 30% that engineers handle is not the boring 30%. It's the hard 30%.

Architecture decisions: how should the database be structured so it can scale? What happens to performance when you go from 100 users to 100,000? These decisions, made early, determine whether the software can grow with the business or needs to be rebuilt. AI can suggest options. Only an experienced engineer knows which option is right for your specific situation.

Security: every public-facing application is under constant automated attack. Handling user authentication correctly, storing sensitive data safely, protecting APIs from abuse — this requires active knowledge of current vulnerabilities and how to address them. AI coding tools are aware of common security patterns, but they don't know your specific deployment context, and they don't catch every class of vulnerability.

Debugging: when something breaks in production at 2am, AI can help with code analysis, but the engineer is the one who reads the logs, identifies the interaction between components that's causing the failure, and fixes it without breaking three other things in the process. Debugging is pattern recognition built from experience, and it's still primarily human.

Integration specifics: every third-party API has quirks. Payment processors have edge cases in their charge flow. Email platforms have rate limits that require queue management. Real-time features require specific infrastructure configurations. The template code AI generates is correct in isolation — making it work reliably with your specific stack requires human attention.

**Why the 30% is where the cost lives**

The 70% is faster now. Good. That means less time on the routine parts. What it doesn't do is reduce the time needed for architecture decisions, security review, debugging, and the ongoing maintenance that keeps software running.

When you're evaluating a dev team or comparing proposals, you're primarily evaluating the quality of their 30%. Look at their past projects: did those products stay up? Did they scale? Are those clients still using them? That track record tells you more about the quality of engineering judgment than any technical credential.

**What this means for your project**

For a founder hiring a dev team, the 70/30 rule has a practical implication: speed of delivery is not the only measure of quality. A team that uses AI tools well will complete the 70% faster, which should translate to faster overall timelines and lower costs. But the 30% still takes the time it takes — cutting corners on architecture, security, or testing is what creates the expensive rebuilds six months later.

The best outcome is a team that uses AI tools to move fast on the 70%, freeing their engineering time for deeper attention to the 30% that makes the difference between software that works and software that lasts.`,
  },
  {
    slug: 'build-buy-or-agent',
    title: 'Build, Buy, or Agent? A Framework for Non-Technical Leaders',
    category: 'Business Strategy',
    date: 'February 21, 2026',
    readTime: '6 min read',
    author: 'Arifur Rahman',
    authorTitle: 'CEO, SocioFi Technology',
    authorInitials: 'AR',
    relatedSlugs: ['what-ai-agents-actually-are', '5-things-founders-should-know-before-hiring-dev-team'],
    relatedCourse: { name: 'Build vs Buy vs Agent: The Decision Framework', slug: 'build-vs-buy-vs-agent' },
    content: `Every year, companies make this decision dozens of times and get it wrong in both directions. They build things they should have bought. They buy platforms they needed to build. And increasingly, they miss the agent option entirely — or buy an agent when they needed something else.

Here's a decision framework for non-technical leaders.

**The Build option**

Building means hiring a dev team to create software specific to your needs. The right choice when: your competitive advantage depends on the specific way this software works; no existing product does what you need; you need deep integration with other custom systems; you're building the product that is your business.

The wrong choice when: you're solving a generic problem (expense reporting, scheduling, basic CRM); you're hoping to ship in weeks; your primary motivation is saving money on software licenses.

Build costs more upfront and takes longer than buying, but gives you full ownership and complete control. The total cost of ownership calculation needs to include development, hosting, security updates, and ongoing maintenance — not just the initial build price.

**The Buy option**

Buying means subscribing to existing software — SaaS products built by other companies for problems similar to yours. The right choice when: the problem is well-defined and generic; excellent products already exist; you need to be running in days, not months; the software isn't a competitive differentiator.

The wrong choice when: you need 80% of a product's features but the other 20% fundamentally doesn't fit your workflow; you're paying for functionality you won't use; the vendor's pricing scales in a way that makes it uneconomical as you grow.

The trap with buying is the customization assumption. Off-the-shelf software adapts your processes to its workflow, not the other way around. Many companies pay for customization that the platform can't actually deliver, then realize they needed to build all along.

**The Agent option**

Agents handle specific, automatable workflows — they're not software you use, they're software that does things for you. The right choice when: you have a repetitive, rule-based workflow that currently requires human time; the workflow has clear inputs and outputs; the cost of human time exceeds the cost of building and running the agent.

The wrong choice when: the workflow requires complex judgment, frequent exceptions, or outcomes that vary significantly by context; you're trying to replace a function that requires relationship management; you're hoping an agent will "figure out" an undefined process.

The agent option is genuinely underused. Companies are willing to buy $30K/year SaaS subscriptions for tools that add friction to workflows, when a $5K agent that directly integrates with their existing systems would eliminate the workflow entirely.

**The decision matrix**

Ask these questions in order:

Does an excellent off-the-shelf solution exist that fits 90%+ of your needs, at a price that makes sense for your scale? If yes, buy it.

Is the need a specific, repetitive workflow with clear inputs and outputs? If yes, evaluate the agent option before considering a build.

Is the problem unique to your business, or is it a competitive differentiator? If yes, build it.

Is the buy option available but the fit is only 70-80%? Calculate the real cost: licensing fees plus the cost of working around the gaps. Often a custom build is cheaper over 3 years.

**Total cost of ownership**

The comparison that rarely happens: what does this option cost over 3 years, fully loaded? Build includes development plus 3 years of maintenance and hosting. Buy includes 3 years of licensing plus any customization costs plus the productivity cost of working around limitations. Agent includes build cost plus 3 years of running costs.

When you run this calculation honestly, the answer often surprises people. SaaS subscriptions that seem cheap at $500/month become $18,000 over 3 years. A custom build that seems expensive at $15,000 upfront costs less in total — and fits perfectly.`,
  },
  {
    slug: 'why-your-product-spec-is-wrong',
    title: 'Why Your Product Spec Is Wrong (And How to Fix It)',
    category: 'Product Management',
    date: 'February 14, 2026',
    readTime: '7 min read',
    author: 'Arifur Rahman',
    authorTitle: 'CEO, SocioFi Technology',
    authorInitials: 'AR',
    relatedSlugs: ['how-to-read-a-technical-proposal-in-10-minutes', '5-things-founders-should-know-before-hiring-dev-team'],
    relatedCourse: { name: 'How to Spec a Software Product', slug: 'how-to-spec-a-software-product' },
    content: `The most common reason projects go over budget isn't the dev team. It's the spec they were given to work from.

A bad spec is expensive in every direction. It produces proposals that can't be accurately priced. It creates disputes about what was agreed. It leads to software that technically does what was specified but doesn't actually solve the problem. And it does all of this quietly — nobody identifies a bad spec as the culprit until the damage is already done.

Here's what's wrong with most specs, and how to fix yours.

**The feature list mistake**

Most non-technical founders write specs as feature lists. "Users can register and log in. Users can create a profile. Users can search for other users." The feature list captures what the software has, not what it does for the people using it.

Dev teams work from feature lists just fine — the problem is that feature lists don't carry the context that determines whether the features solve the right problem. A registration flow for a B2B SaaS product is completely different from a registration flow for a consumer marketplace, even if both appear on the feature list as "user registration."

Fix: before the feature list, write user stories. Not "users can search" but "a restaurant owner can search for available delivery drivers by neighborhood and rating, see their profile and recent review, and send a booking request." Now the feature has context. The dev team knows what they're building and why.

**The missing "happy path" problem**

Specs describe what should happen when everything works correctly. They rarely describe what should happen when it doesn't. What happens when a user tries to register with an email that already exists? What happens when a payment fails? What happens when someone uploads a file that's too large?

Every one of these scenarios requires a decision about what the software should do. If the spec doesn't address it, the dev team will make their own decision — and it might not match yours. That's how you end up with software that technically works but doesn't behave the way you expected.

Fix: for every feature in your spec, identify the three most likely failure scenarios and describe the desired behavior for each. This adds time to writing the spec and saves weeks during development.

**The scope inflation trap**

The most common spec problem: trying to describe the finished product instead of the first version of the product. The spec grows to include every feature the software should eventually have, the dev team prices the full scope, and the founder is shocked by the cost and timeline.

The MVP — the minimum viable product — is not the smallest possible version of your idea. It's the smallest version that delivers the core value to a real user. Everything else is a future version.

Fix: for every feature in your spec, ask "does the product fail to deliver its core value without this?" If the answer is no, move it to a "Phase 2" list. Be honest with yourself — most of what founders think is essential for launch isn't.

**The technical assumption problem**

Non-technical founders sometimes include implementation details in their specs: "the database should use PostgreSQL" or "the mobile app should be built in React Native." These decisions might be correct. They might not be. Either way, they constrain the dev team's choices in ways that aren't necessarily in your interest.

Your spec should describe what the software needs to do and the constraints that matter for your business: it needs to load in under 2 seconds, it needs to work on iOS and Android, it needs to integrate with Stripe. How those requirements are achieved is the dev team's job.

Fix: separate requirements from implementation preferences. "I need to be able to switch dev teams without rewriting everything" is a legitimate requirement. "Use PostgreSQL" is an implementation preference. State requirements; let the team propose implementation.

**The template approach**

Here's a simple structure that works for most software projects:

What problem does this solve? One paragraph describing the situation the software addresses and for whom.

Who uses it? The specific people who will interact with the software, and what they're trying to accomplish.

Core features (MVP): the numbered list of features required for the first working version, each with a plain-language description of the behavior and the key failure scenarios.

Out of scope for MVP: explicit list of features that will not be in the first version. This prevents scope creep and signals to the dev team that you've thought carefully about what's essential.

Technical constraints: the requirements that constrain implementation choices — performance targets, platform requirements, integrations.

A spec written to this template gets better proposals, causes fewer disputes, and produces software that actually solves the problem it was built to solve.`,
  },
];

// ── Related Courses ───────────────────────────────────────────────────────────
const SIDEBAR_COURSES = [
  { name: 'AI Development for Founders', slug: 'ai-development-for-founders', duration: '6 hours', price: 149 },
  { name: 'How to Spec a Software Product', slug: 'how-to-spec-a-software-product', duration: '4 hours', price: 79 },
  { name: 'Understanding AI Agents for Business', slug: 'understanding-ai-agents-for-business', duration: '4 hours', price: 99 },
];

const CATEGORY_GRADIENTS: Record<string, string> = {
  'AI Development': `linear-gradient(135deg, ${A}44 0%, rgba(74,108,184,0.3) 100%)`,
  'AI Agents': `linear-gradient(135deg, rgba(123,111,232,0.3) 0%, ${A}33 100%)`,
  'Product Management': `linear-gradient(135deg, ${A}33 0%, rgba(77,191,168,0.3) 100%)`,
  'Business Strategy': `linear-gradient(135deg, rgba(58,88,158,0.3) 0%, ${A}44 100%)`,
};

function getCatGradient(cat: string) {
  return CATEGORY_GRADIENTS[cat] || `linear-gradient(135deg, ${A}33 0%, ${A}11 100%)`;
}

// ── Styles ────────────────────────────────────────────────────────────────────
const STYLES = `
.art-page { background: var(--bg); min-height: 100vh; }

/* Breadcrumb */
.art-breadcrumb {
  padding: 120px 32px 0;
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 8px;
}
.art-breadcrumb-link {
  font-family: ${F.b};
  font-size: 0.82rem;
  color: var(--text-muted);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: color 0.2s;
}
.art-breadcrumb-link:hover { color: ${A}; }
.art-breadcrumb-sep {
  color: var(--text-muted);
  font-size: 0.75rem;
}
.art-breadcrumb-current {
  font-family: ${F.b};
  font-size: 0.82rem;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
}

/* Layout */
.art-layout {
  padding: 40px 32px 100px;
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 60px;
  align-items: start;
}
@media (max-width: 960px) {
  .art-layout {
    grid-template-columns: 1fr;
    gap: 48px;
  }
}

/* Article */
.art-article {}
.art-cat-tag {
  display: inline-block;
  font-family: ${F.m};
  font-size: 0.68rem;
  color: ${A};
  background: ${A}15;
  border: 1px solid ${A}33;
  border-radius: 6px;
  padding: 4px 10px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 16px;
}
.art-title {
  font-family: ${F.h};
  font-size: clamp(1.8rem, 3.5vw, 2.6rem);
  font-weight: 800;
  line-height: 1.12;
  letter-spacing: -0.03em;
  color: var(--text-primary);
  margin-bottom: 20px;
}
.art-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}
.art-meta-author {
  display: flex;
  align-items: center;
  gap: 10px;
}
.art-meta-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${A}33, ${A}66);
  border: 1.5px solid ${A}44;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${F.h};
  font-size: 0.7rem;
  font-weight: 800;
  color: ${A};
  flex-shrink: 0;
}
.art-meta-name {
  font-family: ${F.h};
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text-primary);
}
.art-meta-role {
  font-family: ${F.b};
  font-size: 0.76rem;
  color: var(--text-secondary);
}
.art-meta-sep {
  width: 1px;
  height: 28px;
  background: var(--border);
}
.art-meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: ${F.b};
  font-size: 0.8rem;
  color: var(--text-muted);
}

/* Thumbnail */
.art-thumb {
  height: 240px;
  border-radius: 16px;
  margin-bottom: 36px;
  overflow: hidden;
  position: relative;
}

/* Body */
.art-body {
  font-family: ${F.b};
  font-size: 1rem;
  line-height: 1.8;
  color: var(--text-secondary);
}
.art-body p {
  margin-bottom: 20px;
}
.art-body p:last-child {
  margin-bottom: 0;
}
.art-body strong {
  font-family: ${F.h};
  font-weight: 700;
  color: var(--text-primary);
  display: block;
  margin-top: 32px;
  margin-bottom: 10px;
  font-size: 1.05rem;
  letter-spacing: -0.01em;
}

/* CTA Strip */
.art-course-cta {
  margin-top: 48px;
  padding: 28px 32px;
  background: linear-gradient(135deg, ${A}18 0%, ${A}0a 100%);
  border: 1.5px solid ${A}44;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}
.art-course-cta-text {
  font-family: ${F.b};
  font-size: 0.9rem;
  color: var(--text-secondary);
}
.art-course-cta-text strong {
  font-family: ${F.h};
  font-weight: 700;
  color: var(--text-primary);
  display: inline;
  font-size: inherit;
  margin: 0;
}
.art-course-cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: ${A};
  color: #0C0C1D;
  font-family: ${F.h};
  font-size: 0.84rem;
  font-weight: 700;
  border-radius: 100px;
  text-decoration: none;
  white-space: nowrap;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 3px 14px ${A}44;
}
.art-course-cta-btn:hover {
  transform: translateY(-1px) scale(1.02);
  box-shadow: 0 6px 20px ${A}55;
}

/* Sidebar */
.art-sidebar {
  position: sticky;
  top: 100px;
}
.art-sidebar-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
}
.art-sidebar-heading {
  font-family: ${F.m};
  font-size: 0.7rem;
  color: ${A};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 16px;
}
.art-sidebar-author-name {
  font-family: ${F.h};
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 2px;
}
.art-sidebar-author-role {
  font-family: ${F.b};
  font-size: 0.82rem;
  color: var(--text-secondary);
  margin-bottom: 12px;
}
.art-sidebar-linkedin {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: ${F.b};
  font-size: 0.78rem;
  color: ${A};
  text-decoration: none;
  transition: opacity 0.2s;
}
.art-sidebar-linkedin:hover { opacity: 0.75; }

.art-course-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
  text-decoration: none;
  color: inherit;
  transition: opacity 0.2s;
}
.art-course-item:last-child { border-bottom: none; }
.art-course-item:hover { opacity: 0.8; }
.art-course-item-name {
  font-family: ${F.h};
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.3;
}
.art-course-item-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: ${F.b};
  font-size: 0.76rem;
  color: var(--text-muted);
}
.art-course-price { color: ${A}; font-weight: 600; }

/* Newsletter */
.art-newsletter-label {
  font-family: ${F.m};
  font-size: 0.68rem;
  color: ${A};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 10px;
}
.art-newsletter-title {
  font-family: ${F.h};
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 14px;
}
.art-newsletter-input {
  width: 100%;
  padding: 10px 14px;
  background: var(--bg-2);
  border: 1.5px solid var(--border);
  border-radius: 10px;
  font-family: ${F.b};
  font-size: 0.84rem;
  color: var(--text-primary);
  outline: none;
  margin-bottom: 8px;
  box-sizing: border-box;
  transition: border-color 0.2s;
}
.art-newsletter-input::placeholder { color: var(--text-muted); }
.art-newsletter-input:focus { border-color: ${A}66; }
.art-newsletter-btn {
  width: 100%;
  padding: 10px;
  background: ${A};
  color: #0C0C1D;
  font-family: ${F.h};
  font-size: 0.84rem;
  font-weight: 700;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.art-newsletter-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px ${A}44;
}

/* Related */
.art-related {
  padding: 60px 32px 100px;
  max-width: 1100px;
  margin: 0 auto;
  border-top: 1px solid var(--border);
}
.art-related-title {
  font-family: ${F.h};
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
  margin-bottom: 32px;
}
.art-related-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
@media (max-width: 768px) {
  .art-related-grid { grid-template-columns: 1fr; }
}
.art-related-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 14px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.3s, transform 0.3s;
}
.art-related-card:hover {
  border-color: ${A}44;
  transform: translateY(-3px);
}
.art-related-thumb {
  height: 100px;
  position: relative;
}
.art-related-cat {
  position: absolute;
  top: 10px;
  left: 10px;
  font-family: ${F.m};
  font-size: 0.62rem;
  color: ${A};
  background: rgba(12,12,29,0.65);
  border: 1px solid ${A}44;
  border-radius: 4px;
  padding: 2px 7px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  backdrop-filter: blur(6px);
}
.art-related-body { padding: 16px; }
.art-related-art-title {
  font-family: ${F.h};
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.3;
  margin-bottom: 6px;
}
.art-related-meta {
  font-family: ${F.b};
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* 404 */
.art-notfound {
  text-align: center;
  padding: 200px 32px;
}
.art-notfound-title {
  font-family: ${F.h};
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 16px;
}
.art-notfound-sub {
  font-family: ${F.b};
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: 28px;
}
.art-notfound-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: ${A};
  color: #0C0C1D;
  font-family: ${F.h};
  font-size: 0.88rem;
  font-weight: 700;
  border-radius: 100px;
  text-decoration: none;
}

@media (max-width: 768px) {
  .art-breadcrumb { padding: 100px 20px 0; }
  .art-layout { padding: 32px 20px 80px; }
  .art-related { padding: 48px 20px 80px; }
  .art-course-cta { padding: 20px; }
}
`;

// ── Article body renderer ─────────────────────────────────────────────────────
function ArticleBody({ content }: { content: string }) {
  const paragraphs = content.split('\n\n').filter(Boolean);
  return (
    <div className="art-body">
      {paragraphs.map((p, i) => {
        if (p.startsWith('**') && p.endsWith('**')) {
          return <strong key={i}>{p.slice(2, -2)}</strong>;
        }
        // Inline bold handling
        const parts = p.split(/\*\*(.*?)\*\*/g);
        return (
          <p key={i}>
            {parts.map((part, j) =>
              j % 2 === 1 ? <strong key={j} style={{ display: 'inline', marginTop: 0, marginBottom: 0 }}>{part}</strong> : part
            )}
          </p>
        );
      })}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function BlogArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [email, setEmail] = useState('');

  const article = ARTICLES.find(a => a.slug === slug);

  if (!article) {
    return (
      <main className="art-page">
        <style>{STYLES}</style>
        <div className="art-notfound">
          <h1 className="art-notfound-title">Article not found.</h1>
          <p className="art-notfound-sub">This article doesn&apos;t exist or has been moved.</p>
          <Link href="/academy/blog" className="art-notfound-link">
            <ArrowLeftIcon />
            Back to Blog
          </Link>
        </div>
      </main>
    );
  }

  const related = ARTICLES.filter(a => article.relatedSlugs.includes(a.slug));

  return (
    <main className="art-page">
      <style>{STYLES}</style>

      {/* Breadcrumb */}
      <div className="art-breadcrumb">
        <Link href="/academy/blog" className="art-breadcrumb-link">
          <ArrowLeftIcon />
          Academy Blog
        </Link>
        <span className="art-breadcrumb-sep">/</span>
        <span className="art-breadcrumb-current">{article.title}</span>
      </div>

      {/* Layout */}
      <div className="art-layout">
        {/* Article */}
        <article className="art-article">
          <Reveal>
            <span className="art-cat-tag">{article.category}</span>
            <h1 className="art-title">{article.title}</h1>
            <div className="art-meta">
              <div className="art-meta-author">
                <div className="art-meta-avatar">{article.authorInitials}</div>
                <div>
                  <div className="art-meta-name">{article.author}</div>
                  <div className="art-meta-role">{article.authorTitle}</div>
                </div>
              </div>
              <div className="art-meta-sep" />
              <div className="art-meta-item">
                {article.date}
              </div>
              <div className="art-meta-item">
                <ClockIcon />
                {article.readTime}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div
              className="art-thumb"
              style={{ background: getCatGradient(article.category) }}
            />
          </Reveal>

          <Reveal delay={0.15}>
            <ArticleBody content={article.content} />
          </Reveal>

          <Reveal delay={0.2}>
            <div className="art-course-cta">
              <div className="art-course-cta-text">
                Want to go deeper? There&apos;s a course for this.{' '}
                <strong>{article.relatedCourse.name}</strong>
                {' '}covers this topic in full, with exercises and real examples.
              </div>
              <Link
                href={`/academy/courses/${article.relatedCourse.slug}`}
                className="art-course-cta-btn"
              >
                <BookIcon />
                View Course
              </Link>
            </div>
          </Reveal>
        </article>

        {/* Sidebar */}
        <aside className="art-sidebar">
          {/* Author */}
          <Reveal delay={0.2}>
            <div className="art-sidebar-card">
              <div className="art-sidebar-heading">WRITTEN BY</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div className="art-meta-avatar" style={{ width: '44px', height: '44px', fontSize: '0.82rem' }}>
                  {article.authorInitials}
                </div>
                <div>
                  <div className="art-sidebar-author-name">{article.author}</div>
                  <div className="art-sidebar-author-role">{article.authorTitle}</div>
                </div>
              </div>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="art-sidebar-linkedin">
                <LinkedInIcon />
                Connect on LinkedIn
              </a>
            </div>
          </Reveal>

          {/* Also in Academy */}
          <Reveal delay={0.25}>
            <div className="art-sidebar-card">
              <div className="art-sidebar-heading">ALSO IN ACADEMY</div>
              {SIDEBAR_COURSES.map(c => (
                <Link key={c.slug} href={`/academy/courses/${c.slug}`} className="art-course-item">
                  <span className="art-course-item-name">{c.name}</span>
                  <span className="art-course-item-meta">
                    <span>{c.duration}</span>
                    <span>·</span>
                    <span className="art-course-price">${c.price}</span>
                  </span>
                </Link>
              ))}
            </div>
          </Reveal>

          {/* Newsletter */}
          <Reveal delay={0.3}>
            <div className="art-sidebar-card">
              <div className="art-newsletter-label">WEEKLY ARTICLES</div>
              <div className="art-newsletter-title">New articles every Tuesday.</div>
              <input
                type="email"
                className="art-newsletter-input"
                placeholder="Your email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                aria-label="Newsletter email"
              />
              <button className="art-newsletter-btn">Subscribe</button>
            </div>
          </Reveal>
        </aside>
      </div>

      {/* Related Posts */}
      {related.length > 0 && (
        <section className="art-related">
          <Reveal>
            <h2 className="art-related-title">Related articles</h2>
          </Reveal>
          <div className="art-related-grid">
            {related.map((r, i) => (
              <Reveal key={r.slug} delay={i * 0.08}>
                <Link href={`/academy/blog/${r.slug}`} className="art-related-card">
                  <div
                    className="art-related-thumb"
                    style={{ background: getCatGradient(r.category) }}
                  >
                    <span className="art-related-cat">{r.category}</span>
                  </div>
                  <div className="art-related-body">
                    <div className="art-related-art-title">{r.title}</div>
                    <div className="art-related-meta">{r.author} · {r.date}</div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
