// ─────────────────────────────────────────────────────────────────────────────
// SocioFi Technology — Blog Data Layer
// Hardcoded data that can later be replaced with DB/CMS calls.
// ─────────────────────────────────────────────────────────────────────────────

export type BlogCategory =
  | 'ai-development'
  | 'ai-agents'
  | 'engineering'
  | 'business'
  | 'case-studies'
  | 'tutorials'
  | 'company'
  | 'experiments';

export interface BlogAuthor {
  slug: string;
  name: string;
  role: string;
  type: 'human' | 'ai_agent';
  avatarInitials: string;
  accentColor: string;
  bio: string;
  divisions: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: BlogCategory;
  divisions: string[];
  author: BlogAuthor;
  authorType: 'human' | 'ai_agent';
  editedBy?: string;
  publishedAt: string;
  readingTime: string;
  tags: string[];
  featured: boolean;
  canonicalUrl: string;
}

// ── Category Config ───────────────────────────────────────────────────────────

export const CATEGORY_IMAGES: Record<BlogCategory, string> = {
  'ai-development': '/images/blog/ai-development.jpg',
  'ai-agents':      '/images/blog/ai-agents.jpg',
  engineering:      '/images/blog/engineering.jpg',
  business:         '/images/blog/business.jpg',
  'case-studies':   '/images/blog/case-studies.jpg',
  tutorials:        '/images/blog/tutorials.jpg',
  company:          '/images/blog/company.jpg',
  experiments:      '/images/blog/experiments.jpg',
};

export const CATEGORY_CONFIG: Record<BlogCategory, { label: string; color: string; description: string }> = {
  'ai-development': {
    label: 'AI Development',
    color: '#72C4B2',
    description: 'Methodology, AI coding process, and quality gates.',
  },
  'ai-agents': {
    label: 'AI Agents',
    color: '#8B5CF6',
    description: 'Architecture, use cases, deployment, and AaaS.',
  },
  engineering: {
    label: 'Engineering',
    color: '#7B6FE8',
    description: 'Deep technical: patterns, code, architecture.',
  },
  business: {
    label: 'Business',
    color: '#6BA3E8',
    description: 'Strategy, decisions, and founder guides.',
  },
  'case-studies': {
    label: 'Case Studies',
    color: '#E8916F',
    description: 'Project stories, results, client impact.',
  },
  tutorials: {
    label: 'Tutorials',
    color: '#E8B84D',
    description: 'Step-by-step how-to guides.',
  },
  company: {
    label: 'Company',
    color: '#4DBFA8',
    description: 'News, milestones, and team updates.',
  },
  experiments: {
    label: 'Experiments',
    color: '#E05555',
    description: 'Research results including failures — radical transparency.',
  },
};

// ── Authors ───────────────────────────────────────────────────────────────────

const arifur: BlogAuthor = {
  slug: 'arifur-rahman',
  name: 'Arifur Rahman',
  role: 'CEO & Co-Founder',
  type: 'human',
  avatarInitials: 'AR',
  accentColor: '#59A392',
  bio: 'Arifur co-founded SocioFi Technology and leads company strategy, client relationships, and product direction. BUET graduate. Based in Dhaka.',
  divisions: ['studio', 'academy', 'ventures'],
};

const kamrul: BlogAuthor = {
  slug: 'kamrul-hasan',
  name: 'Kamrul Hasan',
  role: 'CTO & Co-Founder',
  type: 'human',
  avatarInitials: 'KH',
  accentColor: '#4A6CB8',
  bio: 'Kamrul leads engineering at SocioFi Technology. He architects AI-native development workflows, oversees technical quality, and runs the Labs research team. BUET graduate.',
  divisions: ['labs', 'engineering', 'cloud'],
};

const scribe: BlogAuthor = {
  slug: 'scribe',
  name: 'SCRIBE',
  role: 'AI Content Agent',
  type: 'ai_agent',
  avatarInitials: 'SC',
  accentColor: '#7B6FE8',
  bio: 'SCRIBE is SocioFi\'s in-house AI content agent. It drafts technical articles that are then reviewed, edited, and approved by a human engineer or founder before publication.',
  divisions: ['labs', 'academy', 'agents'],
};

const team: BlogAuthor = {
  slug: 'team',
  name: 'The SocioFi Team',
  role: 'Collective',
  type: 'human',
  avatarInitials: 'SF',
  accentColor: '#E8B84D',
  bio: 'Posts authored collectively by the SocioFi Technology team, drawing on shared knowledge across engineering, product, and strategy.',
  divisions: ['technology'],
};

const AUTHORS: BlogAuthor[] = [arifur, kamrul, scribe, team];

// ── Posts ─────────────────────────────────────────────────────────────────────

const POSTS: BlogPost[] = [
  {
    slug: 'how-we-build-software-5x-faster',
    title: 'How We Build Software 5x Faster Than Traditional Agencies',
    excerpt:
      'AI handles 70% of the implementation. Engineers handle the 30% that decides whether the product actually works in production. Here is exactly how that split works in practice.',
    body: `
<p>When people hear "AI builds 70% of your software," they picture a chatbot spitting out rough code that someone has to clean up. That is not what we do. The 70% AI handles is high-quality, structured, tested implementation — functions, components, API routes, database queries. The 30% our engineers own is the work that determines whether any of it makes it to production.</p>

<h2>What the 70% looks like</h2>
<p>Our AI agents work from a detailed technical specification that our engineers write. Given a well-scoped spec, the agent produces component code, unit tests, API handlers, and type definitions. It does this faster than any human can type, and it does not make the copy-paste errors humans do.</p>
<ul>
  <li><strong>React components</strong> — full implementations with props, state, and event handlers</li>
  <li><strong>API routes</strong> — endpoint logic, validation, and error responses</li>
  <li><strong>Database queries</strong> — typed queries with parameterisation and pagination</li>
  <li><strong>Unit tests</strong> — coverage for the happy path and common error cases</li>
</ul>

<h2>What the 30% looks like</h2>
<p>The 30% that engineers own is not editing AI code. It is the set of decisions the AI cannot make correctly without human judgment:</p>
<ul>
  <li><strong>Architecture review</strong> — Does this component model hold under real user load? Is this the right data structure for a schema that will grow?</li>
  <li><strong>Security audit</strong> — AI misses injection vectors, insecure direct object references, and authentication edge cases. Every endpoint gets a manual review.</li>
  <li><strong>Database migrations</strong> — Changing a live schema requires judgment about data distribution, rollback strategy, and downtime tolerance. AI does not have this context.</li>
  <li><strong>Deployment configuration</strong> — Environment variables, CDN rules, edge function placement, serverless timeouts. These are infrastructure decisions with real consequences.</li>
  <li><strong>Monitoring setup</strong> — What gets alerted on. What error rates are acceptable. How the on-call rotation works.</li>
</ul>

<h2>Why this is actually 5x faster</h2>
<p>A traditional agency spends roughly 60-70% of its engineering time on implementation — writing functions, components, and queries. If you can move that work to AI without losing quality, the engineering team redirects to architecture, review, and deployment. Projects that used to take 12 weeks take 3.</p>
<p>The catch is that this only works if the specification is precise and the human review is rigorous. Skipping the review is how you get a fast prototype that fails in production. We have seen enough of those to know exactly where the failures happen.</p>
<p>That is why our process is not "AI first, humans later." It is "humans spec, AI builds, humans verify." The ratio is 70/30. The sequence matters as much as the split.</p>
    `.trim(),
    category: 'ai-development',
    divisions: ['labs', 'studio'],
    author: kamrul,
    authorType: 'human',
    publishedAt: '2026-03-15',
    readingTime: '12 min read',
    tags: ['methodology', 'ai-development', '70-30', 'production'],
    featured: true,
    canonicalUrl: '/blog/how-we-build-software-5x-faster',
  },

  {
    slug: 'the-70-30-split',
    title: 'The 70/30 Split: What AI Writes vs What Engineers Write',
    excerpt:
      'A precise breakdown of what our AI agents produce versus what engineers own. The line is sharper than you might expect — and knowing where it falls changes how you think about cost and speed.',
    body: `
<p>Every project we build follows the same allocation: roughly 70% of implementation is AI-generated, 30% is engineer-written. But the interesting question is not the ratio — it is where the line actually falls.</p>

<h2>AI writes: implementation</h2>
<p>Given a well-structured specification, our AI agents are excellent at implementation — the translation of a clear requirement into working code. This includes:</p>
<ul>
  <li>UI components and their state logic</li>
  <li>Form validation and submission handlers</li>
  <li>Data fetching and caching logic</li>
  <li>Type definitions and interfaces</li>
  <li>Standard API endpoint handlers</li>
  <li>Unit and integration test scaffolding</li>
</ul>

<h2>Engineers write: architecture and judgment</h2>
<p>The 30% engineers own is not remediation of bad AI code. It is the work that requires judgment that cannot be captured in a prompt:</p>
<ul>
  <li>The specification itself — the thing the AI builds from</li>
  <li>System architecture decisions: how services communicate, where state lives</li>
  <li>Security review of every authentication and data access path</li>
  <li>Database schema design and migration strategy</li>
  <li>Infrastructure configuration and deployment pipeline</li>
  <li>Performance testing under realistic load</li>
  <li>Monitoring, alerting, and incident response setup</li>
</ul>

<h2>The line is about reversibility</h2>
<p>The clearest way to draw the line: AI handles the work that is cheap to regenerate if wrong. Engineers own the work that is expensive to reverse — architecture decisions baked into a schema, security assumptions embedded in auth logic, infrastructure patterns that affect every future deployment.</p>
<p>This framing also explains why the ratio matters less than the sequence. The spec comes first (engineer), then implementation (AI), then review and deployment (engineer). You cannot reorder those steps without breaking the quality guarantee.</p>
    `.trim(),
    category: 'ai-development',
    divisions: ['labs'],
    author: kamrul,
    authorType: 'human',
    publishedAt: '2026-03-10',
    readingTime: '8 min read',
    tags: ['methodology', '70-30', 'ai-development', 'engineering'],
    featured: false,
    canonicalUrl: '/blog/the-70-30-split',
  },

  {
    slug: 'why-ai-generated-code-needs-human-review',
    title: 'Why AI-Generated Code Needs Human Review (With Real Examples)',
    excerpt:
      'AI writes good code. It also writes specific categories of bad code — reliably, predictably, and in ways that are hard to catch without knowing where to look. Here is what those failure modes look like.',
    body: `
<p>AI-generated code is often good. Frequently very good. The problem is that its failure modes are systematic — the same types of errors appear across models, across prompts, across codebases. Once you know the pattern, you can review for it. Before you know the pattern, you will miss it.</p>

<h2>Failure mode 1: the happy path is complete, the error path is not</h2>
<p>AI writes the success case beautifully. When the API call succeeds, when the user input is valid, when the database returns a result — all of that is handled. What happens when the third-party service returns a 503? When the database connection pool is exhausted? When the file upload exceeds the size limit? Often: an unhandled exception, a generic 500 error, or silent failure.</p>

<h2>Failure mode 2: security assumptions that look correct</h2>
<p>AI tends to implement auth patterns that are structurally correct but miss context-specific edge cases. A route that correctly validates a JWT token but fails to check whether the user in the token is authorised to access the specific resource being requested. An upload endpoint that checks file type by extension rather than MIME type. A query that is parameterised but logs the full query string to an accessible log file.</p>

<h2>Failure mode 3: performance assumptions that do not hold at scale</h2>
<p>Code that works for a single user frequently does not work for a thousand. AI generates N+1 queries — fetching a list and then querying for each item individually. It generates unindexed queries on columns that will be filtered frequently. It generates in-memory operations on datasets that will eventually not fit in memory.</p>

<h2>What good review looks like</h2>
<p>Human review of AI code is not line-by-line reading. It is structured examination of the categories most likely to fail. We run a checklist: error handling completeness, authentication and authorisation correctness, query performance, input validation, secret handling, and log hygiene. This takes less time than writing the code from scratch and catches the systematic failures reliably.</p>
<p>The goal is not to distrust AI code. The goal is to know exactly which questions to ask about it.</p>
    `.trim(),
    category: 'ai-development',
    divisions: ['labs'],
    author: scribe,
    authorType: 'ai_agent',
    editedBy: 'Kamrul Hasan',
    publishedAt: '2026-03-05',
    readingTime: '10 min read',
    tags: ['code-review', 'ai-development', 'security', 'quality'],
    featured: false,
    canonicalUrl: '/blog/why-ai-generated-code-needs-human-review',
  },

  {
    slug: 'client-communication-when-ai-builds-fast',
    title: 'Client Communication When AI Builds Fast: Managing Expectations at Speed',
    excerpt:
      'When a project moves from kickoff to demo in two weeks, clients expect the same timeline for feedback, decisions, and approvals. Most are not prepared for that. Here is how we handle it.',
    body: `
<p>The speed of AI-native development creates a communication problem most clients do not anticipate. Traditional agencies have a natural rhythm — weeks between milestones, time for feedback to settle, room for scope to shift. When we deliver a working prototype in ten days, that rhythm breaks.</p>

<h2>The decision bottleneck</h2>
<p>In our experience, the most common cause of a fast project stalling is not technical — it is waiting for a decision. A colour choice that needs the CEO. A copy approval that needs legal. A feature priority that needs a stakeholder meeting. When development cycles are measured in days, a two-day approval wait is significant.</p>

<h2>What we do at kickoff</h2>
<p>We spend significant time in the kickoff conversation establishing decision-making authority. Specifically: who can approve design decisions, who can approve scope changes, and who can approve the final launch. We need one person with full authority — not a committee, not a consensus process.</p>
<ul>
  <li>Design approvals: needs to happen within 24 hours of receiving a preview</li>
  <li>Scope change requests: decided in the same call they are raised, or deferred to post-launch</li>
  <li>Launch approval: a single person with authority to say yes</li>
</ul>

<h2>The preview rhythm</h2>
<p>We share previews frequently — often daily during active development. This sounds like it would overwhelm clients, but the opposite is true. Frequent small previews prevent the "it is not what I imagined" conversation that derails projects. Each preview is a low-stakes checkpoint, not a formal review.</p>

<h2>What we tell clients directly</h2>
<p>We tell every client at kickoff: your job during this engagement is to respond quickly and decide clearly. The technical work will not be the bottleneck. If you can hold up your end, we will hold up ours. Most clients appreciate the directness — they have been through slow projects before and do not want another one.</p>
    `.trim(),
    category: 'ai-development',
    divisions: ['studio'],
    author: arifur,
    authorType: 'human',
    publishedAt: '2026-03-01',
    readingTime: '6 min read',
    tags: ['client-communication', 'process', 'project-management'],
    featured: false,
    canonicalUrl: '/blog/client-communication-when-ai-builds-fast',
  },

  {
    slug: 'what-ai-agents-actually-are',
    title: 'What AI Agents Actually Are (No Hype, No Jargon)',
    excerpt:
      'An AI agent is a program that can decide what to do next based on its goal and what it observes. That is it. Here is what that means in practice for business workflows.',
    body: `
<p>The term "AI agent" is used to describe everything from a simple chatbot to a fully autonomous software engineer. That range makes it nearly useless as a description. Here is a more precise version.</p>

<h2>The core definition</h2>
<p>An AI agent is a program that receives a goal, observes its environment, decides what action to take next, takes that action, and then re-evaluates. The key difference from traditional automation is the "decides what to do next" part. Standard automation follows a fixed sequence of steps. An agent chooses its steps based on what it observes.</p>

<h2>What agents can and cannot do</h2>
<p>Agents are good at:</p>
<ul>
  <li>Tasks that require reading and understanding unstructured text</li>
  <li>Multi-step workflows where the next step depends on the result of the previous one</li>
  <li>Processes where the inputs vary significantly between instances</li>
  <li>Work that requires synthesising information from multiple sources</li>
</ul>
<p>Agents are not good at:</p>
<ul>
  <li>Tasks requiring creative judgment (visual design, tone-sensitive writing, novel strategy)</li>
  <li>Workflows where legal or regulatory review is required at each step</li>
  <li>Anything requiring physical world interaction</li>
  <li>Tasks where the cost of an error is catastrophic and irreversible</li>
</ul>

<h2>A concrete example</h2>
<p>A customer support agent receives an email. It reads the email, identifies the issue, checks the customer record in your CRM, looks up the relevant policy, drafts a response, and sends it — or escalates to a human if the situation does not fit a clear resolution path. That is an agent: it reads, reasons, decides, acts, and knows when to hand off.</p>

<h2>The business question to ask</h2>
<p>Before deploying an agent, ask: what does this process look like today? Who does it, how long does it take, and what does a mistake cost? If the process is high-volume, reasonably well-defined, and tolerates occasional errors, it is a candidate. If it is low-volume, highly variable, or error-intolerant, it probably is not.</p>
    `.trim(),
    category: 'ai-agents',
    divisions: ['agents', 'academy'],
    author: scribe,
    authorType: 'ai_agent',
    editedBy: 'Kamrul Hasan',
    publishedAt: '2026-02-25',
    readingTime: '9 min read',
    tags: ['ai-agents', 'explainer', 'business', 'automation'],
    featured: false,
    canonicalUrl: '/blog/what-ai-agents-actually-are',
  },

  {
    slug: 'lessons-from-45-production-agents',
    title: 'Lessons from 45 Production Agents: What We Got Right and What We\'d Change',
    excerpt:
      'After building and maintaining 45 production AI agents across industries, the patterns are clear: what works, what fails, and the three decisions that determine most outcomes.',
    body: `
<p>Forty-five agents in production. Across industries: garment manufacturing, financial services, legal, healthcare administration, e-commerce, internal tooling. Here is what that experience distills into.</p>

<h2>What we got right</h2>
<p><strong>Human escalation paths from day one.</strong> Every agent we have built has a defined escalation path — a situation in which the agent stops and hands control to a human. The agents where we designed this in from the start have dramatically lower incident rates than the ones where we added it later.</p>
<p><strong>Structured outputs over free text.</strong> Agents that produce structured JSON responses — rather than free-text answers — are dramatically easier to integrate with existing systems and to test. The overhead of defining the schema pays off within the first week.</p>
<p><strong>Tight tool scopes.</strong> Agents with fewer, more specific tools perform better than agents with broad general capabilities. A customer support agent that can query your CRM, your knowledge base, and your ticketing system — and nothing else — is more reliable than one that can also browse the web and write code.</p>

<h2>What we would change</h2>
<p><strong>Testing earlier and more systematically.</strong> We now run structured reliability tests before any agent goes to production. Early agents did not get this — and several of them failed in ways that systematic testing would have caught.</p>
<p><strong>Better observability from the start.</strong> Knowing that an agent ran is not the same as knowing what it did and why. We now log every tool call, every decision, and every escalation. Early agents had minimal logging, which made debugging production issues slow and expensive.</p>
<p><strong>Smaller scope launches.</strong> Agents that launched handling 100% of a workflow had worse outcomes than agents that launched handling 20% — with humans covering the rest — and then scaled up as confidence grew. The gradual rollout is now standard.</p>

<h2>The three decisions that determine most outcomes</h2>
<p>First: is the workflow actually suitable for automation? Second: are the escalation paths designed before the agent is built? Third: is there a human who owns this agent's performance and is accountable for its errors? Get all three right and the agent will succeed. Miss any of them and you will be fixing it in production.</p>
    `.trim(),
    category: 'ai-agents',
    divisions: ['labs'],
    author: kamrul,
    authorType: 'human',
    publishedAt: '2026-02-20',
    readingTime: '14 min read',
    tags: ['ai-agents', 'production', 'lessons-learned', 'engineering'],
    featured: false,
    canonicalUrl: '/blog/lessons-from-45-production-agents',
  },

  {
    slug: 'saas-to-aaas-transition',
    title: 'The SaaS to AaaS Transition: What It Actually Means for Your Business',
    excerpt:
      'AaaS — Agents as a Service — is not just SaaS with AI branding. The business model, the pricing, and the integration requirements are genuinely different. Here is what you need to know.',
    body: `
<p>Agent as a Service (AaaS) is being sold as an evolution of SaaS. In some ways it is. In others, it is a genuinely different category of software purchase — with different integration requirements, different pricing models, and different ways of measuring value.</p>

<h2>How AaaS differs from SaaS</h2>
<p>SaaS gives you a tool. You use the tool to do work. AaaS gives you a worker — one that takes goals as input and produces outcomes as output. The practical implication: with SaaS, you control every step of the process. With AaaS, you describe what you want and the agent decides how to get there.</p>
<p>That shift in control is the defining characteristic of AaaS — and it is also the source of most of the anxiety around it. Businesses that have been burned by software that did unexpected things are right to be cautious about software that makes decisions.</p>

<h2>What to evaluate when buying AaaS</h2>
<ul>
  <li><strong>Escalation visibility</strong> — Can you see when the agent escalated and why? What did it hand off?</li>
  <li><strong>Audit trail</strong> — Is there a complete log of every action the agent took?</li>
  <li><strong>Scope boundaries</strong> — What systems can the agent access? What can it not touch?</li>
  <li><strong>Override mechanism</strong> — How do you stop the agent on a specific case? On all cases immediately?</li>
  <li><strong>Error accountability</strong> — When the agent makes a mistake, who is responsible and what is the remediation process?</li>
</ul>

<h2>Pricing models and what they reveal</h2>
<p>AaaS vendors price in one of three ways: per task completed, per hour of agent time, or flat monthly subscription. Per-task pricing aligns vendor incentives with your outcomes — they do better when the agent is useful. Flat subscription pricing is simpler to budget but does not align incentives the same way. Be sceptical of per-hour pricing for agents: it incentivises inefficiency.</p>

<h2>The transition question</h2>
<p>The right question for most businesses is not "should we switch from SaaS to AaaS" but "which of our existing SaaS workflows is a candidate for agent automation?" Start there — with a specific, well-defined workflow — before considering a broader transition.</p>
    `.trim(),
    category: 'ai-agents',
    divisions: ['academy'],
    author: arifur,
    authorType: 'human',
    publishedAt: '2026-02-15',
    readingTime: '7 min read',
    tags: ['aaas', 'saas', 'business-model', 'ai-agents'],
    featured: false,
    canonicalUrl: '/blog/saas-to-aaas-transition',
  },

  {
    slug: 'when-ai-agents-are-overkill',
    title: 'When AI Agents Are Overkill (And What to Use Instead)',
    excerpt:
      'Agents are powerful, but they are also expensive, complex, and require ongoing maintenance. A lot of problems are better solved with a script, a webhook, or a Zapier flow. Here is how to tell the difference.',
    body: `
<p>We build AI agents for a living, so we have a commercial incentive to tell you that every problem needs an agent. We are going to do the opposite: here is a clear framework for when not to build an agent.</p>

<h2>The agent overhead</h2>
<p>Agents are stateful, non-deterministic, and hard to test exhaustively. They require prompt engineering, tool definitions, escalation logic, observability infrastructure, and ongoing evaluation. The overhead is real — typically 3–4 weeks of engineering time to build correctly and ongoing maintenance to keep reliable.</p>

<h2>When a simpler solution is better</h2>
<p><strong>Fixed-sequence automation</strong> — If your process always follows the same steps in the same order, a workflow tool (Zapier, Make, n8n) is faster, cheaper, and more reliable. Agents are for processes where the steps vary based on what the agent observes.</p>
<p><strong>Single-step tasks</strong> — If the task is "classify this email" or "extract these fields from this document," a direct API call to an AI model with a structured output schema is simpler and more predictable than a full agent system.</p>
<p><strong>Low-volume processes</strong> — An agent that handles 10 tasks per month is hard to justify economically. The break-even for agent overhead is usually somewhere around 50–100 tasks per month, depending on the complexity and the alternative cost.</p>
<p><strong>High-stakes, irreversible actions</strong> — If an error means sending a wrong payment, deleting customer data, or making a binding commitment, the process probably needs human review at each step. Agents are not appropriate as the sole decision-maker in these workflows.</p>

<h2>The decision sequence</h2>
<p>Before building an agent, ask in this order: Can this be solved with a script? Can it be solved with a workflow tool? Can it be solved with a single AI model call? If all three are no, then an agent is probably the right tool. If any are yes, use the simpler option — and come back to agents when the process has grown complex enough to justify them.</p>
    `.trim(),
    category: 'ai-agents',
    divisions: ['agents'],
    author: scribe,
    authorType: 'ai_agent',
    editedBy: 'Arifur Rahman',
    publishedAt: '2026-02-10',
    readingTime: '6 min read',
    tags: ['ai-agents', 'automation', 'decision-framework', 'pragmatism'],
    featured: false,
    canonicalUrl: '/blog/when-ai-agents-are-overkill',
  },

  {
    slug: 'human-gate-pattern',
    title: 'The Human Gate Pattern: Inserting Oversight Into Agent Workflows',
    excerpt:
      'Full autonomy is rarely the right architecture for production agents. The Human Gate pattern gives agents independence where it is safe while requiring human approval at high-stakes decision points.',
    body: `
<p>The most common mistake in agent architecture is treating autonomy as a binary: either the agent is fully autonomous, or a human does the work. In practice, most production workflows need something in between — and the Human Gate pattern is how we implement it.</p>

<h2>What a Human Gate is</h2>
<p>A Human Gate is a defined point in an agent workflow where the agent pauses, presents what it has determined to a human reviewer, and waits for approval before proceeding. The agent does the work of analysis and preparation; the human makes the consequential decision; the agent then executes.</p>

<h2>When to insert a gate</h2>
<p>Gates belong at decisions that are:</p>
<ul>
  <li><strong>Irreversible</strong> — sending a payment, deleting a record, making a commitment on behalf of the business</li>
  <li><strong>High-value</strong> — actions affecting large amounts of money, sensitive data, or key relationships</li>
  <li><strong>Novel</strong> — cases that do not fit a pattern the agent has handled reliably before</li>
  <li><strong>Externally visible</strong> — communications to customers, partners, or regulators</li>
</ul>

<h2>Implementation pattern</h2>
<p>The agent workflow pauses and creates a review task: a structured summary of what it observed, what it is proposing to do, and why. The reviewer sees the agent's reasoning, approves or modifies the proposed action, and the agent executes. The full decision trail — what the agent proposed, what the human changed, what was ultimately done — is logged.</p>

<h2>The practical outcome</h2>
<p>In our experience, agents with well-designed Human Gates have significantly lower error rates than fully autonomous agents and require dramatically less human time than fully manual processes. The gate adds friction at exactly the right points — where friction is appropriate — while allowing the agent to handle the volume that makes automation worthwhile.</p>
<p>The goal is not to limit the agent. It is to concentrate human attention where it matters most. Human Gates are the mechanism that makes that concentration possible.</p>
    `.trim(),
    category: 'engineering',
    divisions: ['labs'],
    author: kamrul,
    authorType: 'human',
    publishedAt: '2026-02-05',
    readingTime: '11 min read',
    tags: ['agent-architecture', 'human-in-the-loop', 'patterns', 'engineering'],
    featured: false,
    canonicalUrl: '/blog/human-gate-pattern',
  },

  {
    slug: 'database-schema-patterns',
    title: 'Database Schema Patterns for Common Business Applications',
    excerpt:
      'Most business applications need the same ten things from their database. Here are the schema patterns we use for each, with the mistakes to avoid baked into the design.',
    body: `
<p>After building dozens of business applications, the schema requirements converge on the same patterns. Here are the ones we use for the most common cases, with the reasoning that led to them.</p>

<h2>Multi-tenant data isolation</h2>
<p>Every table that contains tenant-specific data gets an <code>organisation_id</code> column. Every query includes a <code>WHERE organisation_id = $current_org</code> clause. Row-level security policies enforce this at the database level — not just in application code. This is the pattern that prevents the most common data leak: a query that is correct in single-tenant context becoming catastrophically incorrect when shared infrastructure is introduced.</p>

<h2>Soft deletes</h2>
<p>We use <code>deleted_at TIMESTAMP</code> rather than <code>is_deleted BOOLEAN</code>. The timestamp tells you when the deletion happened, which is often important for auditing and debugging. All queries add <code>WHERE deleted_at IS NULL</code> by default. Indexes include this condition. Deleted records are periodically archived, not truly deleted, unless regulatory requirements demand it.</p>

<h2>Audit logging</h2>
<p>Any table representing business-critical state gets a shadow audit table. Insert, update, and delete operations write the full row — before and after — to the audit table, along with the timestamp and the actor (user or agent) that made the change. This is implemented as a trigger, not application code, so it fires for all changes regardless of how they originate.</p>

<h2>Status columns</h2>
<p>Status columns use a string enum rather than an integer enum. <code>'pending'</code>, <code>'active'</code>, <code>'completed'</code> is debuggable in a database console without a lookup table. Add a check constraint to enforce valid values. Add an index because status columns are almost always in WHERE clauses.</p>

<h2>The mistakes these patterns avoid</h2>
<p>The patterns above exist because the alternatives create specific production problems: data leaks between tenants, inability to recover accidentally deleted records, inability to debug what changed and when, and query performance problems from unindexed filter columns. Each pattern is a response to a failure we have seen in production.</p>
    `.trim(),
    category: 'engineering',
    divisions: ['labs'],
    author: scribe,
    authorType: 'ai_agent',
    editedBy: 'Kamrul Hasan',
    publishedAt: '2026-01-30',
    readingTime: '13 min read',
    tags: ['database', 'schema', 'patterns', 'engineering', 'postgresql'],
    featured: false,
    canonicalUrl: '/blog/database-schema-patterns',
  },

  {
    slug: 'component-library-ai-can-use',
    title: 'Building a Component Library That AI Can Use Correctly',
    excerpt:
      'AI agents generate better component code when the component library is designed with clear constraints and explicit prop contracts. Here is what that looks like in practice.',
    body: `
<p>Most component libraries are designed for human developers. When AI agents are generating the code that uses them, the design requirements shift. Here is what we changed in our component library after a year of AI-native development.</p>

<h2>Explicit prop contracts over flexibility</h2>
<p>AI agents do better with components that have clear, constrained APIs than with components that are flexible but ambiguous. A <code>Button</code> component with a <code>variant</code> prop that accepts <code>'primary' | 'secondary' | 'ghost'</code> is used correctly more often than a button that accepts arbitrary className overrides. The constraint is the documentation.</p>

<h2>Semantic names over descriptive names</h2>
<p>Components named for their role in the design system — <code>SectionHeader</code>, <code>CardContent</code>, <code>MetaLine</code> — are used more consistently by AI agents than components named for their appearance — <code>LargeBoldText</code>, <code>GreySmallText</code>. The semantic name carries intent that the AI can apply to the right context.</p>

<h2>Composition over configuration</h2>
<p>A <code>Card</code> component with <code>Card.Header</code>, <code>Card.Body</code>, and <code>Card.Footer</code> sub-components generates more consistent output from AI agents than a monolithic <code>Card</code> component with fifty optional props. The composition pattern makes the structure visible in the usage, which helps the agent reason about what belongs where.</p>

<h2>TypeScript types as guardrails</h2>
<p>Strict TypeScript types catch a category of AI agent errors before they reach review. If the agent tries to pass a string where the component expects a specific union type, the type checker catches it. We treat TypeScript errors in AI-generated code as signals about component API clarity — if the agent repeatedly makes the same type error, the API probably needs to be redesigned.</p>

<h2>What we document differently</h2>
<p>Component documentation for an AI-native workflow includes explicit do-not-use guidance: which props are deprecated, which combinations produce layout problems, which props should be left at their default. This negative documentation is often more useful than the positive description.</p>
    `.trim(),
    category: 'engineering',
    divisions: ['labs'],
    author: kamrul,
    authorType: 'human',
    publishedAt: '2026-01-25',
    readingTime: '10 min read',
    tags: ['component-library', 'engineering', 'ai-development', 'typescript'],
    featured: false,
    canonicalUrl: '/blog/component-library-ai-can-use',
  },

  {
    slug: 'evaluate-software-proposal',
    title: 'How to Evaluate a Software Development Proposal (Without Being Technical)',
    excerpt:
      'Most proposal red flags are not technical. They are in how the scope is described, how risk is handled, and what the vendor does not mention. Here is what to look for.',
    body: `
<p>You have received three proposals for your software project. You are not a developer. How do you evaluate them? The answer is not to learn to read code — it is to know which questions the proposal should be answering and what it means when it does not.</p>

<h2>Is the scope precise or vague?</h2>
<p>A good proposal lists specific deliverables: screens, features, integrations, user flows. A vague proposal describes outcomes: "a platform that helps your team work better." Vague scope leads to disagreements about what was included. If a vendor will not commit to specific deliverables in writing before you sign, treat that as a red flag.</p>

<h2>How is change handled?</h2>
<p>Every project changes. The proposal should explain exactly what happens when it does. Is there a change order process? What triggers it? How is additional work priced? Proposals that do not address this leave you exposed to billing surprises when scope inevitably shifts.</p>

<h2>What happens when something breaks?</h2>
<p>The proposal should describe the warranty or support period after launch. What bugs are covered and for how long? What response time can you expect? Who do you contact? If the proposal assumes everything will work perfectly at launch and says nothing about what happens if it does not, that is a problem.</p>

<h2>Who actually does the work?</h2>
<p>Agencies frequently win projects with senior staff visible in the sales process, then deliver using junior staff or subcontractors. Ask directly: who will be working on your project? Will the person you are talking to be involved in delivery? Get the answer in writing if it matters to you.</p>

<h2>What is the timeline based on?</h2>
<p>Timelines that are not explained are guesses. A good proposal explains what assumptions the timeline rests on and what would cause it to slip. Client delays in providing feedback, access, or approvals are almost always a factor — a good proposal acknowledges this rather than presenting the timeline as the vendor's unconditional commitment.</p>
    `.trim(),
    category: 'business',
    divisions: ['academy'],
    author: arifur,
    authorType: 'human',
    publishedAt: '2026-01-20',
    readingTime: '8 min read',
    tags: ['business', 'proposals', 'non-technical', 'evaluation'],
    featured: false,
    canonicalUrl: '/blog/evaluate-software-proposal',
  },

  {
    slug: 'build-vs-buy-vs-agent',
    title: 'Build vs Buy vs Agent: When Each Makes Sense',
    excerpt:
      'The decision used to be build or buy. Now there is a third option: deploy an agent. Here is a framework for thinking through which choice fits your situation.',
    body: `
<p>For most business software problems, there are now three viable paths: build a custom solution, buy an off-the-shelf product, or deploy an AI agent. Each has a distinct profile of cost, risk, and fit. Here is how to think about the choice.</p>

<h2>When to buy</h2>
<p>Buy when your need is generic. If hundreds of businesses have the same problem and there are established products solving it — accounting, CRM, HR management, project management — buying is almost always the right answer. The product has been tested by thousands of users, the bugs have been found, and the vendor is investing in improvements continuously.</p>
<p>The signal that you should buy: you are describing your need in terms that match the marketing copy of an existing product.</p>

<h2>When to build</h2>
<p>Build when your need is genuinely differentiated — when the thing you are building is itself a competitive advantage, or when no existing product fits without significant compromise. Building is expensive and slow, but it produces something you own and can shape entirely.</p>
<p>The signal that you should build: your need is core to your product and unique enough that existing tools would require so much customisation that you are effectively building anyway.</p>

<h2>When to deploy an agent</h2>
<p>Deploy an agent when your need is a repeating workflow — not a product, but a process. Data entry, document processing, customer communication triage, internal request routing. Agents are strong at taking a well-defined process and running it at scale without the overhead of a full software build.</p>
<p>The signal that you should deploy an agent: you can describe the process as a series of steps that a reasonably capable human could follow given clear instructions.</p>

<h2>The hybrid reality</h2>
<p>Most businesses end up with a combination. Buy the category tools (CRM, accounting, project management). Build the things that are genuinely differentiating. Deploy agents for the high-volume repetitive processes that neither category addresses well. The frameworks are not mutually exclusive — they apply to different problems within the same organisation.</p>
    `.trim(),
    category: 'business',
    divisions: ['academy'],
    author: scribe,
    authorType: 'ai_agent',
    editedBy: 'Arifur Rahman',
    publishedAt: '2026-01-15',
    readingTime: '6 min read',
    tags: ['business', 'build-vs-buy', 'ai-agents', 'decision-framework'],
    featured: false,
    canonicalUrl: '/blog/build-vs-buy-vs-agent',
  },

  {
    slug: 'true-cost-of-software',
    title: 'The True Cost of Software: Why $50K Agencies and $199 Agents Both Exist',
    excerpt:
      'Software cost varies by four orders of magnitude depending on what you are actually buying. Most confusion about pricing comes from comparing products in different categories. Here is how to read the market clearly.',
    body: `
<p>A custom software project from a traditional agency costs $30,000–$200,000. An AI agent subscription costs $99–$500 per month. An AI-native development engagement costs $8,000–$40,000. These are all "software" but they are not remotely comparable products. Here is how to read the pricing landscape clearly.</p>

<h2>What drives cost</h2>
<p>Software cost is determined by three variables: scope (how much needs to be built), quality requirements (how reliable, secure, and maintainable), and talent cost (who is building it). Each of these varies independently. A $200,000 agency engagement is a large scope, with high quality requirements, built by expensive talent in a high-cost market. A $99 agent subscription is a narrow scope (one workflow), with defined quality characteristics, delivered by infrastructure the vendor built once and amortises across many customers.</p>

<h2>Why the $50K agency exists</h2>
<p>Custom software from an agency is expensive because it is custom — built for your specific requirements, your data model, your users. The engineering cost is real and not shared with other clients. What you are buying is something that does not exist yet and that you own entirely. This is appropriate when the thing you are building is core to your competitive advantage.</p>

<h2>Why the $199 agent exists</h2>
<p>Agent subscriptions are cheap because the vendor built the core system once and configures it for each customer. The software cost is amortised across hundreds of customers. What you are buying is access to a workflow that has already been engineered — not something built for you. This is appropriate when your workflow is similar enough to what the agent already does.</p>

<h2>Why AI-native development sits in between</h2>
<p>An AI-native development engagement delivers custom software, but the AI handles a significant portion of implementation. The human engineering cost — architecture, review, deployment — is real, but the implementation cost is substantially lower. This is the appropriate model when you need something custom but cannot justify the full cost of traditional development.</p>
<p>The categories are not competing. They solve different problems. The mistake is applying pricing expectations from one category to a product in another.</p>
    `.trim(),
    category: 'business',
    divisions: ['labs'],
    author: arifur,
    authorType: 'human',
    publishedAt: '2026-01-10',
    readingTime: '7 min read',
    tags: ['business', 'pricing', 'software-cost', 'value'],
    featured: false,
    canonicalUrl: '/blog/true-cost-of-software',
  },

  {
    slug: 'inboxflow-story',
    title: 'From AI Prototype to Live SaaS in 18 Days: The InboxFlow Story',
    excerpt:
      'A founder came to us with a working Next.js prototype he had built with AI coding tools. Eighteen days later, InboxFlow was live with paying customers. Here is exactly what we did.',
    body: `
<p>The founder of InboxFlow had built a working prototype. It handled email triage for small teams — routing messages, generating draft replies, and flagging high-priority items. It worked on his laptop. It crashed in production. He came to us with 18 days before a demo to investors.</p>

<h2>Day 1–3: diagnosis</h2>
<p>We spent the first three days doing nothing but auditing what existed. The code quality was higher than we expected — the AI coding tools had produced clean, readable component code. The problems were architectural: no error handling on API routes, environment variables hardcoded in source files, authentication that worked for single-user testing but would fail for multi-tenant use, and a database schema that would not support the access patterns the product needed.</p>

<h2>Day 4–8: foundation repair</h2>
<p>Before building anything new, we fixed the foundations. Proper environment variable management. A multi-tenant database schema with row-level security. Authentication through a proper provider rather than hand-rolled JWT handling. Error handling on every API route. This was not glamorous work, but it was the work that made production viable.</p>

<h2>Day 9–14: feature completion</h2>
<p>With the foundation solid, we used AI agents to build the remaining features: team management, billing integration, usage analytics, and the onboarding flow. The AI generated the implementation; our engineers reviewed it. Because the underlying architecture was now correct, each feature built on a stable base.</p>

<h2>Day 15–18: launch preparation</h2>
<p>Deployment configuration, SSL, CDN setup, monitoring and alerting, load testing, and the go-live checklist. InboxFlow went live on day 18. The investor demo happened on day 19. The product handled 400 signups in the first week without issues.</p>

<h2>What made it work</h2>
<p>The existing prototype was not wasted — it gave us a working UI and clear product direction. The diagnosis phase was not skipped — it gave us a clear picture of what needed to change. And the timeline was aggressive but not reckless: 18 days to production is achievable when the scope is defined and the team does not waffle on decisions.</p>
    `.trim(),
    category: 'case-studies',
    divisions: ['studio'],
    author: arifur,
    authorType: 'human',
    publishedAt: '2026-01-05',
    readingTime: '5 min read',
    tags: ['case-study', 'saas', 'prototype-rescue', 'studio'],
    featured: false,
    canonicalUrl: '/blog/inboxflow-story',
  },

  {
    slug: 'fabricxai-story',
    title: '22 Agents in a Factory: How FabricxAI Transformed Garment Manufacturing',
    excerpt:
      'FabricxAI is our AI agent platform for garment manufacturers. This is the story of how it was built — from the first factory pilot to a system running 22 coordinated agents across an entire production floor.',
    body: `
<p>Garment manufacturing is one of the most complex coordination problems in manufacturing. Hundreds of SKUs, dozens of production stages, unpredictable supplier lead times, and customers demanding real-time order visibility. FabricxAI is our answer to this problem — a network of 22 coordinated AI agents managing the production floor.</p>

<h2>The problem we started with</h2>
<p>Our first client ran a mid-size garment factory in Dhaka. Their coordination system was a combination of WhatsApp groups, Excel sheets, and tribal knowledge held by long-tenured employees. When an order was delayed, figuring out why and replanning took 4–6 hours. They were losing clients to competitors who could give real-time status updates.</p>

<h2>Agent 1: the order intake agent</h2>
<p>We started with a single agent: one that read incoming orders from email and buyer portals, extracted the structured data (style, quantity, delivery date, fabric specifications), and entered it into the production management system. This replaced 3 hours of daily manual data entry. The agent handled 95% of orders correctly; the remaining 5% were flagged for human review.</p>

<h2>Building out the network</h2>
<p>Over six months, we added agents for production scheduling, supplier communication, quality control documentation, shipment tracking, and customer updates. Each agent was scoped tightly — one function, clear inputs and outputs, defined escalation conditions. The agents communicated through a shared data layer: each agent read from and wrote to the same production database, so actions in one part of the workflow were immediately visible to agents managing other parts.</p>

<h2>22 agents, one floor</h2>
<p>The current deployment runs 22 agents. They collectively handle order intake, production scheduling, supplier purchasing, quality documentation, shipment coordination, customer communication, and compliance reporting. Human staff focus on exception handling, supplier relationships, and quality decisions that require physical inspection.</p>
<p>Average order-to-ship time decreased by 23%. Late shipments decreased by 67%. The same production floor is handling 40% more orders with the same headcount.</p>
    `.trim(),
    category: 'case-studies',
    divisions: ['products'],
    author: kamrul,
    authorType: 'human',
    publishedAt: '2026-01-01',
    readingTime: '10 min read',
    tags: ['case-study', 'fabricxai', 'manufacturing', 'ai-agents'],
    featured: false,
    canonicalUrl: '/blog/fabricxai-story',
  },

  {
    slug: 'replacing-14-hours-with-3-agents',
    title: 'Replacing 14 Hours of Weekly Work with 3 Agents at $647/Month',
    excerpt:
      'A professional services firm was spending 14 hours a week on manual admin tasks. Three agents later, those hours are gone. The economics are straightforward — and replicable.',
    body: `
<p>This is a straightforward case study about economics. A professional services firm was spending 14 staff-hours per week on three categories of admin work. We deployed three agents. The work is now done automatically. Here are the numbers.</p>

<h2>The 14 hours</h2>
<p>The time broke down as follows: 6 hours per week on client onboarding paperwork (collecting information, creating accounts, sending welcome packs), 5 hours per week on invoice follow-up (checking payment status, sending reminders, escalating overdue invoices), and 3 hours per week on meeting scheduling (back-and-forth coordination across time zones).</p>

<h2>Agent 1: onboarding (6 hours → 25 minutes human review)</h2>
<p>The onboarding agent receives a new client confirmation, sends the information collection form, processes the responses, creates accounts in the CRM and project management tool, and sends the welcome pack. A human reviews the completed pack before it goes out — 25 minutes of review instead of 6 hours of processing.</p>

<h2>Agent 2: invoice follow-up (5 hours → 0 human time)</h2>
<p>The invoice agent monitors payment status in the accounting system, sends reminders at 7, 14, and 28 days overdue, and escalates invoices beyond 35 days to a human for relationship management. The escalation is the only human touchpoint — and it is only for the cases that genuinely need human judgment.</p>

<h2>Agent 3: meeting scheduling (3 hours → automated)</h2>
<p>The scheduling agent handles the calendar coordination: receiving scheduling requests, checking availability, proposing times, handling rescheduling, and sending confirmations. It handles 90% of scheduling without human involvement.</p>

<h2>The economics</h2>
<p>The three agents cost $647 per month. The 14 hours of staff time, at the firm's fully-loaded cost, was costing approximately $2,100 per month. The net saving is roughly $1,450 per month — a payback period of less than two months on the implementation cost. The staff time freed up was redirected to billable client work.</p>
    `.trim(),
    category: 'case-studies',
    divisions: ['agents'],
    author: scribe,
    authorType: 'ai_agent',
    editedBy: 'Arifur Rahman',
    publishedAt: '2025-12-28',
    readingTime: '6 min read',
    tags: ['case-study', 'ai-agents', 'roi', 'automation', 'professional-services'],
    featured: false,
    canonicalUrl: '/blog/replacing-14-hours-with-3-agents',
  },

  {
    slug: 'how-to-write-a-product-spec',
    title: 'How to Write a Product Spec That Development Teams Can Build From',
    excerpt:
      'A bad spec wastes weeks. A good spec is the most valuable thing you can give a development team. Here is exactly how to write one — from someone who reads them for a living.',
    body: `
<p>We receive dozens of project enquiries each month. The ones where we can give a confident, accurate proposal within 48 hours are the ones with a clear spec. The ones that require three calls and two weeks of back-and-forth are the ones without one. Here is how to write the former.</p>

<h2>Start with the problem, not the solution</h2>
<p>The most common spec mistake is describing what you want to build before explaining why. Start with: who has this problem, what does it cost them today, and what does success look like when it is solved? This framing prevents the expensive mistake of building the wrong solution to the right problem.</p>

<h2>Describe the user flows, not the features</h2>
<p>Features are things software has. User flows are things people do. "A dashboard with analytics" is a feature. "A marketing manager logs in, sees their campaign performance for the last 30 days, and can export a report for their weekly meeting" is a user flow. User flows are more useful because they reveal what the feature actually needs to do.</p>

<h2>Be explicit about scope boundaries</h2>
<p>The most useful thing a spec can say is what is not included. "This version does not include mobile support," "this does not handle multi-currency billing," "this does not integrate with legacy ERP systems." Explicit scope boundaries prevent scope creep and align expectations before contracts are signed.</p>

<h2>List your constraints</h2>
<p>Technology constraints (must integrate with Salesforce, must work on IE11), timeline constraints (must launch before the event on March 15), budget constraints (fixed at $40,000), and compliance constraints (must be GDPR compliant, data cannot leave the EU). These constraints are not negotiating positions — they are requirements that will determine the solution architecture.</p>

<h2>Describe what good looks like</h2>
<p>How will you know the product is working? Define the criteria: "response time under 2 seconds for 95th percentile requests," "zero data loss on payment processing," "onboarding flow completes in under 10 minutes for a new user." Measurable success criteria give the development team something to build toward and give you something to evaluate against.</p>
    `.trim(),
    category: 'tutorials',
    divisions: ['academy'],
    author: arifur,
    authorType: 'human',
    publishedAt: '2025-12-22',
    readingTime: '9 min read',
    tags: ['tutorials', 'product-spec', 'non-technical', 'project-planning'],
    featured: false,
    canonicalUrl: '/blog/how-to-write-a-product-spec',
  },

  {
    slug: 'reading-technical-docs-without-panicking',
    title: 'Reading Technical Documentation Without Panicking: A Guide for Non-Developers',
    excerpt:
      'Technical documentation is not as hard to read as it looks. Once you know what to ignore, what to look for, and what questions to ask, most docs become navigable in minutes.',
    body: `
<p>At some point, every non-technical founder or manager ends up staring at technical documentation. An API reference. A database schema. A deployment guide. It looks impenetrable. It does not have to be.</p>

<h2>What to ignore</h2>
<p>Start by identifying what you do not need to understand. In API documentation: the authentication section (your developer handles this), the SDK installation instructions (same), and the low-level endpoint parameters that apply only to edge cases. In architecture documentation: the specific technology choices (which database, which framework) unless you have strong opinions. In deployment guides: the server configuration details. Ignore those layers and the document shrinks dramatically.</p>

<h2>What to focus on</h2>
<p>In API documentation: the list of things the API can do (the endpoint names and brief descriptions), the data structure it returns (what fields are available), and the pricing or rate limits. In architecture documentation: the data flow (what goes in, what comes out, what gets stored where) and the integration points. In deployment guides: the prerequisites (what needs to exist before this can work) and the estimated time and effort.</p>

<h2>The question to ask about everything</h2>
<p>"What problem does this solve, and what does it cost?" Apply this to every technical choice your team makes. If your engineer cannot answer this clearly, they either do not know, or the choice is not well-reasoned. Both are useful information.</p>

<h2>How to read a technical diagram</h2>
<p>Look at what the arrows connect. Arrows represent data flow or control flow — something moves from one box to another. Start at the user or customer (usually on the left or top), follow the arrows, and ask what is happening at each step. You will not understand every box, but you will understand the overall flow.</p>

<h2>When to stop reading and start asking</h2>
<p>If you have been reading for 15 minutes and cannot summarise what the document is about, stop reading and ask. The best question is: "Can you walk me through this in plain language, focusing on what it means for the project?" A good engineer will be able to answer this in five minutes.</p>
    `.trim(),
    category: 'tutorials',
    divisions: ['academy'],
    author: scribe,
    authorType: 'ai_agent',
    editedBy: 'Arifur Rahman',
    publishedAt: '2025-12-18',
    readingTime: '5 min read',
    tags: ['tutorials', 'non-technical', 'documentation', 'communication'],
    featured: false,
    canonicalUrl: '/blog/reading-technical-docs-without-panicking',
  },

  {
    slug: 'autonomous-code-review-agent-failed',
    title: 'When Our Autonomous Code Review Agent Failed (And What We Learned)',
    excerpt:
      'We built an autonomous code review agent, deployed it in our pipeline, and it failed in a specific and instructive way. Here is what happened, why it happened, and what we changed.',
    body: `
<p>Radical transparency. We build AI agents. We use AI agents in our own workflow. One of them failed in a way that taught us something important. Here is the story.</p>

<h2>What we built</h2>
<p>We deployed an autonomous code review agent in our development pipeline. The agent received pull requests, reviewed the code for security issues, performance problems, and conformance to our code standards, and left comments. We gave it the ability to approve PRs if it found no significant issues, and to request changes if it did.</p>

<h2>What went wrong</h2>
<p>Over three weeks, the agent approved 47 pull requests. Four of those PRs contained issues that should have been caught — two security-relevant and two performance-relevant. The agent missed them. When we investigated why, the pattern was clear: the agent was good at identifying issues that matched patterns it had been explicitly trained to look for, and poor at identifying novel issues that required contextual reasoning about the specific codebase.</p>

<h2>The specific failure mode</h2>
<p>In one case, a PR introduced a query that would work correctly in isolation but would cause an N+1 performance problem when called in the context of an existing endpoint. The agent reviewed the PR in isolation, saw a correctly written query, and approved it. A human reviewer with context about the calling code would have caught the problem immediately.</p>

<h2>What we changed</h2>
<p>We removed the agent's ability to approve PRs autonomously. It still reviews, comments, and flags issues — but all PRs now require human approval. The agent's comments are useful and save review time; the autonomous approval was where the risk was concentrated. We also added a requirement that the agent review the calling context, not just the changed lines — which caught a similar issue within the first week of the new configuration.</p>

<h2>The lesson</h2>
<p>Autonomous approval is a Human Gate decision. We had designed the agent with the wrong scope of autonomy for the risk level. Code review approval is consequential and context-dependent — exactly the conditions that require a human gate. We knew this principle; we did not apply it correctly in this case. Now we do.</p>
    `.trim(),
    category: 'experiments',
    divisions: ['labs'],
    author: kamrul,
    authorType: 'human',
    publishedAt: '2025-12-15',
    readingTime: '7 min read',
    tags: ['experiments', 'failure', 'ai-agents', 'code-review', 'lessons-learned'],
    featured: false,
    canonicalUrl: '/blog/autonomous-code-review-agent-failed',
  },
];

// ── Helper Functions ──────────────────────────────────────────────────────────

export function getAllPosts(filters?: {
  division?: string;
  category?: BlogCategory;
  author?: string;
}): BlogPost[] {
  let posts = [...POSTS];

  if (filters?.division) {
    posts = posts.filter((p) => p.divisions.includes(filters.division!));
  }
  if (filters?.category) {
    posts = posts.filter((p) => p.category === filters.category);
  }
  if (filters?.author) {
    posts = posts.filter((p) => p.author.slug === filters.author);
  }

  // Sort by publishedAt descending
  return posts.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function getPostsByDivision(division: string): BlogPost[] {
  return getAllPosts({ division });
}

export function getPostsByCategory(category: BlogCategory): BlogPost[] {
  return getAllPosts({ category });
}

export function getPostsByAuthor(authorSlug: string): BlogPost[] {
  return getAllPosts({ author: authorSlug });
}

export function getFeaturedPost(): BlogPost {
  return POSTS.find((p) => p.featured) ?? POSTS[0];
}

export function getRelatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  const candidates = POSTS.filter((p) => p.slug !== post.slug).map((p) => {
    let score = 0;
    if (p.category === post.category) score += 3;
    p.divisions.forEach((d) => { if (post.divisions.includes(d)) score += 2; });
    p.tags.forEach((t) => { if (post.tags.includes(t)) score += 1; });
    return { post: p, score };
  });

  return candidates
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((c) => c.post);
}

export function getAllAuthors(): BlogAuthor[] {
  return AUTHORS;
}

export function getAuthorBySlug(slug: string): BlogAuthor | undefined {
  return AUTHORS.find((a) => a.slug === slug);
}

export function formatPostDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
