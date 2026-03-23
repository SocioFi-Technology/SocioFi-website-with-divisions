// src/lib/labs.ts

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface ResearchStream {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  status: 'active' | 'paused' | 'completed';
  since: string;
  articles: number;
  experiments: number;
  findings: string[];
  nextUp: string;
  relatedStreams: string[];
}

export interface LabsArticle {
  slug: string;
  title: string;
  excerpt: string;
  stream: string;
  date: string;
  readTime: number;
  tags: string[];
  featured?: boolean;
  status: 'published' | 'draft';
}

export interface Experiment {
  id: string;
  title: string;
  hypothesis: string;
  status: 'running' | 'completed' | 'failed' | 'abandoned';
  stream: string;
  started: string;
  ended?: string;
  result?: string;
  learnings: string[];
  nextExperiment?: string;
}

export interface OpenSourceProject {
  slug: string;
  name: string;
  description: string;
  tagline: string;
  category: 'tooling' | 'framework' | 'dataset' | 'benchmark';
  language: string;
  stars?: number;
  license: string;
  status: 'active' | 'maintenance' | 'archived';
  repoUrl?: string;
  docsUrl?: string;
  relatedStream: string;
}

// ─── Research Streams ─────────────────────────────────────────────────────────

export const researchStreams: ResearchStream[] = [
  {
    slug: 'agent-architecture',
    title: 'Agent Architecture',
    tagline: 'How do you build AI agents that are reliable, observable, and composable in production?',
    description:
      'Multi-agent coordination is hard. Most teams figure this out the expensive way — after something breaks in production. We research coordination patterns, tool-use strategies, memory architecture, and failure recovery so that the systems we build (and the ones our clients run) hold up over time.',
    status: 'active',
    since: 'Q2 2024',
    articles: 5,
    experiments: 8,
    findings: [
      'Orchestrator-worker is the only pattern that scales reliably past 5 agents in production.',
      'Human oversight gates are non-negotiable — the question is placement, not existence.',
      'Memory architecture determines long-running agent coherence more than any other factor.',
      'Failure modes must be designed for explicitly; graceful degradation does not emerge organically.',
    ],
    nextUp: 'Hierarchical orchestration patterns for systems with 20+ agents and cross-session state persistence.',
    relatedStreams: ['applied-ai', 'developer-tooling'],
  },
  {
    slug: 'applied-ai',
    title: 'Applied AI',
    tagline: 'What does AI actually do well — and where does it fail — in real production software?',
    description:
      'Not theoretical capability — practical reality. We benchmark AI models on the specific tasks that show up repeatedly in production software: structured data extraction, document intelligence, semantic search, RAG pipeline accuracy, and hallucination in domain-specific contexts. We publish what we find, including the failures.',
    status: 'active',
    since: 'Q3 2024',
    articles: 4,
    experiments: 6,
    findings: [
      'RAG accuracy degrades significantly when document corpora exceed 10,000 chunks without re-ranking.',
      'Structured output extraction reliability drops from 94% to 61% on unformatted source documents.',
      'Hallucination rates in domain-specific contexts are 3-4x higher than general benchmarks suggest.',
      'Prompt engineering ROI decreases sharply once a model exceeds a quality threshold on a given task.',
    ],
    nextUp: 'Multi-modal extraction pipelines and cross-model consistency benchmarks for production RAG.',
    relatedStreams: ['agent-architecture', 'industry-automation'],
  },
  {
    slug: 'developer-tooling',
    title: 'Developer Tooling',
    tagline: 'How do we make AI-assisted development workflows faster, safer, and more auditable?',
    description:
      'AI can write code. That is not the hard part anymore. The hard part is review, auditability, test coverage, and maintaining confidence in code you did not write line-by-line. We research AI-assisted code review, automated test generation, spec-to-code pipelines, and the CI/CD gates that keep AI-generated code production-safe.',
    status: 'active',
    since: 'Q1 2024',
    articles: 3,
    experiments: 7,
    findings: [
      'AI-generated test suites increase coverage from ~45% to ~82% with a net 60% time saving on testing phases.',
      'Code review automation catches syntax and logic errors well; security vulnerabilities require human review.',
      'Natural language spec-to-scaffold pipelines reduce architecture phase time by 40% when specs are precise.',
      'CI/CD gates with AI quality checks reduce production incidents by 35% compared to manual-only review.',
    ],
    nextUp: 'Spec-to-architecture pipelines and automated regression test generation for legacy codebases.',
    relatedStreams: ['agent-architecture', 'applied-ai'],
  },
  {
    slug: 'industry-automation',
    title: 'Industry Automation',
    tagline: 'Which vertical-specific business processes are genuinely automatable today, and which are not?',
    description:
      'The most important question in AI adoption is not "can AI do this?" but "should AI do this, and at what accuracy threshold?" We research document processing, customer communication automation, data extraction workflows, and multi-step orchestration across fintech, legal, logistics, and operations contexts.',
    status: 'active',
    since: 'Q4 2024',
    articles: 3,
    experiments: 5,
    findings: [
      'Document processing automation achieves 90%+ accuracy on structured forms; drops to 65-75% on freeform documents.',
      'Customer communication automation handles 85% of inquiries but creates disproportionate damage in the remaining 15%.',
      'Workflow orchestration ROI depends almost entirely on exception handling design, not the happy-path logic.',
      'Compliance-sensitive automation requires human sign-off at a minimum of 3 decision points per workflow.',
    ],
    nextUp: 'Cross-vertical automation benchmarks and failure-mode taxonomy for regulated industry deployments.',
    relatedStreams: ['applied-ai', 'agent-architecture'],
  },
];

// ─── Articles ─────────────────────────────────────────────────────────────────

export const articles: LabsArticle[] = [
  // agent-architecture stream
  {
    slug: 'orchestrator-worker-the-only-pattern-that-scales',
    title: 'Orchestrator-Worker: The Only Multi-Agent Pattern That Scales in Production',
    excerpt:
      'After running 45 AI agents across three products, one coordination pattern emerged as the clear winner. Here is why orchestrator-worker works and what happens when teams try to skip it.',
    stream: 'agent-architecture',
    date: '2026-03-10',
    readTime: 11,
    tags: ['agents', 'architecture', 'patterns', 'production'],
    featured: true,
    status: 'published',
  },
  {
    slug: 'human-gate-pattern',
    title: 'The Human Gate Pattern: Oversight Without Bottlenecks',
    excerpt:
      'A design pattern for inserting mandatory human approval into automated agent workflows without creating bottlenecks that defeat the purpose of automation.',
    stream: 'agent-architecture',
    date: '2026-01-22',
    readTime: 9,
    tags: ['oversight', 'patterns', 'autonomy', 'production'],
    featured: false,
    status: 'published',
  },
  {
    slug: 'memory-architecture-long-running-agents',
    title: 'Memory Architecture for Long-Running Agent Systems',
    excerpt:
      'Short-term context works for tasks under 30 minutes. Long-running processes need explicit memory architecture or agents lose coherence. Here is what we built.',
    stream: 'agent-architecture',
    date: '2025-11-14',
    readTime: 13,
    tags: ['memory', 'state', 'agents', 'architecture'],
    featured: false,
    status: 'published',
  },

  // applied-ai stream
  {
    slug: 'rag-accuracy-at-scale',
    title: 'RAG Accuracy at Scale: What Our Benchmarks Actually Show',
    excerpt:
      'We ran 1,200 retrieval queries across four pipeline configurations and five corpus sizes. The results are more nuanced than the marketing materials suggest.',
    stream: 'applied-ai',
    date: '2026-02-28',
    readTime: 12,
    tags: ['RAG', 'benchmarks', 'accuracy', 'retrieval'],
    featured: true,
    status: 'published',
  },
  {
    slug: 'hallucination-in-domain-specific-contexts',
    title: 'Hallucination in Domain-Specific Contexts Is 3x Worse Than Benchmarks Suggest',
    excerpt:
      'General-purpose LLM benchmarks undercount hallucination in specialized domains. Our testing across fintech, legal, and logistics documents tells a different story.',
    stream: 'applied-ai',
    date: '2025-12-08',
    readTime: 10,
    tags: ['hallucination', 'benchmarks', 'domain', 'accuracy'],
    featured: false,
    status: 'published',
  },
  {
    slug: 'structured-output-extraction-reality',
    title: 'Structured Output Extraction: The 94% to 61% Drop Nobody Warns You About',
    excerpt:
      'AI extracts structured data from well-formatted documents with impressive accuracy. Give it freeform source material and that number collapses. Here is how we handle it.',
    stream: 'applied-ai',
    date: '2025-09-30',
    readTime: 8,
    tags: ['extraction', 'structured-output', 'production', 'accuracy'],
    featured: false,
    status: 'published',
  },

  // developer-tooling stream
  {
    slug: 'ai-test-generation-real-numbers',
    title: 'AI Test Generation: Real Coverage Numbers from 18 Projects',
    excerpt:
      'We tracked test coverage across 18 Studio projects before and after introducing AI-generated test suites. The improvement is real. The caveats matter too.',
    stream: 'developer-tooling',
    date: '2026-03-01',
    readTime: 9,
    tags: ['testing', 'coverage', 'automation', 'data'],
    featured: true,
    status: 'published',
  },
  {
    slug: 'spec-to-scaffold-pipeline',
    title: 'Spec-to-Scaffold: Converting Natural Language Requirements into Runnable Code',
    excerpt:
      'A pipeline that takes a product specification document and produces a working project scaffold with architecture, routes, schemas, and initial tests. What works and what breaks.',
    stream: 'developer-tooling',
    date: '2025-10-17',
    readTime: 11,
    tags: ['scaffolding', 'spec', 'pipeline', 'automation'],
    featured: false,
    status: 'published',
  },
  {
    slug: 'code-review-automation-limits',
    title: 'Where AI Code Review Works and Where It Absolutely Does Not',
    excerpt:
      'AI code review catches logic errors and style issues reliably. It misses security vulnerabilities at an alarming rate. Here is the data and the gates we put in place.',
    stream: 'developer-tooling',
    date: '2025-08-05',
    readTime: 7,
    tags: ['code-review', 'security', 'automation', 'limits'],
    featured: false,
    status: 'published',
  },

  // industry-automation stream
  {
    slug: 'document-automation-accuracy-thresholds',
    title: 'Document Automation: The Accuracy Threshold That Changes Everything',
    excerpt:
      'At 95% automation accuracy, you save time. At 90%, you create more work. The difference in deployment design between these two outcomes is significant.',
    stream: 'industry-automation',
    date: '2026-02-12',
    readTime: 10,
    tags: ['documents', 'automation', 'accuracy', 'thresholds'],
    featured: false,
    status: 'published',
  },
  {
    slug: 'customer-communication-automation-limits',
    title: 'The 85%/15% Problem in Customer Communication Automation',
    excerpt:
      'Automate 85% of customer inquiries correctly and the 15% you get wrong will cost more than the 85% saved. This is the deployment reality, and how we design around it.',
    stream: 'industry-automation',
    date: '2025-11-25',
    readTime: 8,
    tags: ['customer-service', 'automation', 'failure', 'escalation'],
    featured: false,
    status: 'published',
  },
  {
    slug: 'workflow-orchestration-exception-design',
    title: 'Workflow Orchestration: ROI Lives in Exception Handling, Not the Happy Path',
    excerpt:
      'Every automated workflow looks profitable until you account for exceptions. The teams that succeed design exception handling first and automate second.',
    stream: 'industry-automation',
    date: '2025-07-18',
    readTime: 9,
    tags: ['orchestration', 'workflows', 'exceptions', 'ROI'],
    featured: false,
    status: 'published',
  },
];

// ─── Experiments ──────────────────────────────────────────────────────────────

export const experiments: Experiment[] = [
  {
    id: 'exp-001',
    title: 'Autonomous code review — zero human oversight',
    hypothesis: 'An AI agent can serve as sole code reviewer on production code with no human approval gate.',
    status: 'failed',
    stream: 'developer-tooling',
    started: '2026-02-01',
    ended: '2026-02-28',
    result: 'Agent caught 60% of issues. Missed every critical security vulnerability. One near-miss reached staging.',
    learnings: [
      'AI code review has a hard ceiling for security vulnerability detection that current models cannot cross reliably.',
      'The 40% it missed skewed toward consequence — not cosmetic issues, but logical and security flaws.',
      'Fully autonomous review creates false confidence that is more dangerous than no review at all.',
    ],
    nextExperiment: 'exp-002',
  },
  {
    id: 'exp-002',
    title: 'AI review + mandatory human security pass',
    hypothesis: 'AI handles logic and style review; human engineer handles security pass only. Faster than full human review with equivalent safety.',
    status: 'completed',
    stream: 'developer-tooling',
    started: '2026-03-01',
    ended: '2026-03-15',
    result: 'Review time reduced 45% with equivalent defect detection to full human review. Now standard process.',
    learnings: [
      'Splitting review by concern type (AI for logic, humans for security) is more efficient than sequential full reviews.',
      'Engineers find security-focused review easier when AI has already cleared syntax and logic issues.',
      'The combined approach produces better outcomes than either AI-only or human-only review.',
    ],
    nextExperiment: 'exp-008',
  },
  {
    id: 'exp-003',
    title: 'Fully autonomous production deployment',
    hypothesis: 'A deploy agent can push to production environments without any human approval step.',
    status: 'abandoned',
    stream: 'agent-architecture',
    started: '2025-12-10',
    ended: '2026-01-05',
    learnings: [
      'Production infrastructure has too many environment-specific edge cases for reliable autonomous deployment.',
      'The risk/reward ratio is unfavorable — human sign-off takes 2 minutes and prevents incidents that take hours.',
      'Abandoned in favor of automating pre-production fully while keeping a human gate at production boundary.',
    ],
  },
  {
    id: 'exp-004',
    title: 'RAG pipeline without re-ranking',
    hypothesis: 'Embedding similarity alone is sufficient for accurate retrieval in production RAG pipelines under 5,000 chunks.',
    status: 'failed',
    stream: 'applied-ai',
    started: '2025-10-01',
    ended: '2025-11-01',
    result: 'Accuracy acceptable at under 3,000 chunks. Degrades sharply beyond that threshold regardless of embedding quality.',
    learnings: [
      'Embedding similarity without re-ranking produces a false sense of retrieval quality that only breaks at scale.',
      'Re-ranking adds 80ms latency but prevents the accuracy cliff at higher chunk counts.',
      'Corpus size planning must be part of RAG architecture from day one, not retrofitted.',
    ],
    nextExperiment: 'exp-005',
  },
  {
    id: 'exp-005',
    title: 'Two-stage retrieval with cross-encoder re-ranking',
    hypothesis: 'Adding a cross-encoder re-ranking step after initial retrieval will maintain accuracy at corpus sizes over 10,000 chunks.',
    status: 'completed',
    stream: 'applied-ai',
    started: '2025-11-05',
    ended: '2025-12-01',
    result: 'Accuracy maintained at 91% across corpus sizes from 1,000 to 50,000 chunks. Now standard in all RAG deployments.',
    learnings: [
      'Cross-encoder re-ranking scales well and the latency cost (80-120ms) is acceptable for most production use cases.',
      'The architecture is more complex but the reliability improvement justifies it for any serious production deployment.',
      'Two-stage retrieval should be the default, not an optimization applied after problems appear.',
    ],
  },
  {
    id: 'exp-006',
    title: 'Customer service agent without human escalation path',
    hypothesis: 'A well-trained customer service agent can handle all inquiry types without a human fallback.',
    status: 'failed',
    stream: 'industry-automation',
    started: '2025-09-01',
    ended: '2025-09-30',
    result: '85% of inquiries handled correctly. The 15% failure rate created more negative sentiment than the 85% success rate generated goodwill.',
    learnings: [
      'In customer communication, failure consequence is asymmetric — one bad interaction damages trust disproportionately.',
      'The correct model is not "can AI handle this?" but "what is the acceptable failure rate for this context?"',
      'Human escalation path is now mandatory architecture in all customer-facing automation deployments.',
    ],
  },
  {
    id: 'exp-007',
    title: 'Multi-model cost routing in agent orchestration',
    hypothesis: 'Routing tasks to cheaper, smaller models based on complexity scoring will reduce costs without measurable quality impact.',
    status: 'completed',
    stream: 'agent-architecture',
    started: '2025-08-01',
    ended: '2025-09-15',
    result: '40% cost reduction with no measurable quality loss on task benchmarks. Now standard in all agent deployments.',
    learnings: [
      'Task complexity is predictable enough that routing logic is tractable to implement reliably.',
      'The 40% cost reduction compounds quickly across high-volume agent deployments.',
      'Complexity routing should be a first-class architectural concern, not an optimization added later.',
    ],
  },
  {
    id: 'exp-008',
    title: 'Automated security pattern detection in AI-generated code',
    hypothesis: 'A specialized security-pattern classifier can flag the categories of vulnerabilities that general review agents miss.',
    status: 'running',
    stream: 'developer-tooling',
    started: '2026-03-16',
    learnings: [
      'Early results show promise for SQL injection and XSS detection; SSRF and authentication flaws remain difficult.',
      'Domain-specific training data matters significantly more than model size for security classification.',
    ],
  },
  {
    id: 'exp-009',
    title: 'Workflow orchestration exception taxonomy',
    hypothesis: 'A structured exception taxonomy applied at design time will predict the 80% of edge cases that cause production workflow failures.',
    status: 'abandoned',
    stream: 'industry-automation',
    started: '2025-05-01',
    ended: '2025-07-01',
    learnings: [
      'Exception taxonomies are too domain-specific to generalize across verticals in a useful way.',
      'A checklist approach is more practical than a taxonomy — teams can adapt checklists, not taxonomies.',
      'Redirected research into vertical-specific exception design guides instead.',
    ],
  },
  {
    id: 'exp-010',
    title: 'Spec-to-architecture pipeline for greenfield projects',
    hypothesis: 'A pipeline that converts plain-English product specs into technical architecture documents will reduce Studio architecture phase time by 30%.',
    status: 'running',
    stream: 'developer-tooling',
    started: '2026-02-15',
    learnings: [
      'Pipeline is effective when input specs are precise and scoped; fails on vague or over-broad requirements.',
      'Output quality correlates strongly with spec quality — which has motivated better spec templates upstream.',
    ],
  },
];

// ─── Open Source Projects ─────────────────────────────────────────────────────

export const openSourceProjects: OpenSourceProject[] = [
  {
    slug: 'agent-eval',
    name: 'agent-eval',
    description:
      'Evaluation harness for multi-agent systems. Define agent tasks, expected outputs, and quality criteria. Run structured evaluations across agent configurations. Produces reports on reliability, accuracy, and failure mode distribution.',
    tagline: 'Test your agents before production does.',
    category: 'tooling',
    language: 'TypeScript',
    stars: 312,
    license: 'MIT',
    status: 'active',
    repoUrl: 'https://github.com/sociofi/agent-eval',
    docsUrl: 'https://docs.sociofitechnology.com/agent-eval',
    relatedStream: 'agent-architecture',
  },
  {
    slug: 'prompt-guard',
    name: 'prompt-guard',
    description:
      'Prompt injection detection library for applications that accept user input and pass it to AI models. Detects instruction injection, jailbreak attempts, and role-switching attacks. Integrates with FastAPI, Django, and Flask.',
    tagline: 'Detect injection attacks before they reach your model.',
    category: 'tooling',
    language: 'Python',
    stars: 489,
    license: 'MIT',
    status: 'active',
    repoUrl: 'https://github.com/sociofi/prompt-guard',
    relatedStream: 'applied-ai',
  },
  {
    slug: 'rag-bench',
    name: 'rag-bench',
    description:
      'Benchmarking suite for RAG pipelines. Evaluate retrieval accuracy, re-ranking quality, and end-to-end answer quality across corpus sizes and query types. Includes the benchmark datasets we used in our published research.',
    tagline: 'Benchmark your RAG before your users benchmark it for you.',
    category: 'benchmark',
    language: 'Python',
    stars: 228,
    license: 'Apache 2.0',
    status: 'active',
    repoUrl: 'https://github.com/sociofi/rag-bench',
    docsUrl: 'https://docs.sociofitechnology.com/rag-bench',
    relatedStream: 'applied-ai',
  },
  {
    slug: 'spec-runner',
    name: 'spec-runner',
    description:
      'Converts natural language product specifications into executable test suites. Takes a requirements document as input and outputs Jest or Pytest test files that validate the specified behavior. Works best with structured spec formats.',
    tagline: 'From spec document to test suite in one step.',
    category: 'framework',
    language: 'TypeScript',
    stars: 156,
    license: 'MIT',
    status: 'active',
    repoUrl: 'https://github.com/sociofi/spec-runner',
    relatedStream: 'developer-tooling',
  },
  {
    slug: 'industry-datasets',
    name: 'industry-datasets',
    description:
      'Curated labeled datasets for training and evaluating industry automation models. Includes document processing samples (invoices, contracts, forms), customer inquiry classification sets, and workflow exception examples across fintech, legal, and logistics.',
    tagline: 'Labeled datasets for real-world automation research.',
    category: 'dataset',
    language: 'Python',
    license: 'CC BY 4.0',
    status: 'active',
    repoUrl: 'https://github.com/sociofi/industry-datasets',
    relatedStream: 'industry-automation',
  },
  {
    slug: 'flow-tracer',
    name: 'flow-tracer',
    description:
      'Observability tool for multi-step AI workflows. Traces agent calls, tool invocations, model requests, and intermediate state across a full workflow execution. Outputs structured logs, timeline views, and failure attribution reports.',
    tagline: 'See exactly what your agents did and why.',
    category: 'tooling',
    language: 'TypeScript',
    stars: 274,
    license: 'MIT',
    status: 'active',
    repoUrl: 'https://github.com/sociofi/flow-tracer',
    docsUrl: 'https://docs.sociofitechnology.com/flow-tracer',
    relatedStream: 'agent-architecture',
  },
];

// ─── Helper Functions ─────────────────────────────────────────────────────────

export function getResearchStream(slug: string): ResearchStream | undefined {
  return researchStreams.find((s) => s.slug === slug);
}

export function getArticle(slug: string): LabsArticle | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getArticlesByStream(streamSlug: string): LabsArticle[] {
  return articles.filter((a) => a.stream === streamSlug && a.status === 'published');
}

export function getFeaturedArticles(): LabsArticle[] {
  return articles.filter((a) => a.featured === true && a.status === 'published');
}

export function getExperimentsByStream(streamSlug: string): Experiment[] {
  return experiments.filter((e) => e.stream === streamSlug);
}

export function getOpenSourceByCategory(category: string): OpenSourceProject[] {
  return openSourceProjects.filter((p) => p.category === category);
}
