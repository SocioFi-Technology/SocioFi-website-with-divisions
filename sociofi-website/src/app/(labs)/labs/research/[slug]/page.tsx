'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { useState } from 'react';
import type { Metadata } from 'next';

// ── Accent ────────────────────────────────────────────────────────────────────
const A = '#7B6FE8';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Article {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
}

interface Experiment {
  title: string;
  hypothesis: string;
  status: 'success' | 'partial' | 'failed';
  result: string;
  learning: string;
  date: string;
}

interface Finding {
  title: string;
  evidence: string;
  methodology: string;
}

interface RelatedStream {
  slug: string;
  num: string;
  title: string;
  question: string;
}

interface Stream {
  num: string;
  title: string;
  question: string;
  description: string[];
  methodology: {
    overview: string;
    types: string[];
    measurement: string;
    transparency: string;
  };
  status: string;
  articles: number;
  experiments: number;
  findings: Finding[];
  articlesList: Article[];
  experimentsList: Experiment[];
  whatsNext: { title: string; description: string }[];
  related: RelatedStream[];
}

// ── Stream data ───────────────────────────────────────────────────────────────
const STREAMS: Record<string, Stream> = {
  'agent-architecture': {
    num: '01',
    title: 'Agent Architecture',
    question: 'How do you build AI agents that are reliable, observable, and composable in production?',
    description: [
      'Most AI agent demonstrations look compelling and break under real workloads. The gap between a convincing demo and a production-grade agent system is substantial — and the failure modes are not random. They are predictable, patterned, and preventable if you design for them from the start.',
      'This research stream grew out of our work building FabricxAI (22 coordinating agents) and NEXUS ARIA (12 agents). We hit every failure mode you can imagine: agents that lost context mid-task, tool calls that failed silently, orchestrators that deadlocked, memory that corrupted across sessions. We documented every incident and derived patterns from the wreckage.',
      'The core questions we investigate: Which coordination topologies work at scale and which collapse? Where must human oversight sit to be effective without being a bottleneck? How do you build memory architecture that keeps agents coherent across hour-long tasks? And how do you design failure recovery that degrades gracefully instead of catastrophically?',
      'Everything we learn goes into sociofi-agent-kit and review-gate — the open-source libraries that came out of this stream — and into the architecture of every agent system we build in the Products and Agents divisions.',
    ],
    methodology: {
      overview: 'We run adversarial tests against real production agent systems, not synthetic benchmarks. Every experiment uses actual workloads from Studio projects or our own internal infrastructure.',
      types: [
        'Load testing multi-agent coordination topologies under sustained high-volume task queues',
        'Fault injection: killing individual agents mid-task and measuring system recovery',
        'Memory corruption scenarios: deliberately exhausting context windows and measuring coherence',
        'Tool failure cascades: simulating downstream API failures and testing fallback chains',
        'Human gate placement A/B tests: measuring critical failure rates at different oversight positions',
      ],
      measurement: 'We measure task completion rate, error propagation rate, mean-time-to-recovery, and human intervention frequency. All metrics are compared against a baseline run without the experimental change.',
      transparency: 'Every failed experiment is documented at the same level of detail as successes. We include what we expected, what we observed, and what we changed because of it. Failures often contain more signal than successes.',
    },
    status: 'ACTIVE',
    articles: 5,
    experiments: 8,
    findings: [
      {
        title: 'Orchestrator-worker is the baseline pattern for multi-agent production systems',
        evidence: 'After testing peer-to-peer, hierarchical, and market-based coordination topologies across 12 agent systems of varying sizes, orchestrator-worker proved the only topology that maintained reliability past 5 agents. Peer-to-peer coordination produces exponentially growing communication overhead; market-based systems introduce auction latency that compounds under load.',
        methodology: 'We ported the same task (a 22-step quality control workflow) to each topology and ran it 500 times each, measuring completion rate, latency, and error propagation. Results were consistent across three separate system deployments.',
      },
      {
        title: 'Short-term context alone is insufficient for tasks longer than 30 minutes',
        evidence: 'Agents using only conversational context for memory began exhibiting coherence failures around the 30-minute mark. They would contradict earlier decisions, repeat completed steps, or lose track of constraints established at the start of the task. Agents with explicit memory architecture (structured state objects persisted outside the context window) maintained coherence for multi-hour tasks without degradation.',
        methodology: 'We ran 80 agent tasks of varying duration with and without explicit memory architecture, rating coherence at 10-minute intervals using a rubric scored by two independent reviewers. Coherence failures were defined as contradictions of earlier decisions or repetition of completed steps.',
      },
      {
        title: 'Human oversight gate position matters as much as presence',
        evidence: 'Adding oversight gates without careful placement created bottlenecks that nullified the efficiency gains of automation. Gates positioned after destructive or irreversible actions (database writes, API calls that trigger external effects) with a 15-minute async approval window maintained safety with minimal throughput impact. Gates at every step reduced throughput by 340% with no measurable safety improvement over selective gating.',
        methodology: 'We tested four gating strategies on the same FabricxAI deployment over 90-day periods each, measuring throughput, critical failure rate, and human reviewer approval-to-rejection ratio.',
      },
      {
        title: 'Graceful degradation requires explicit design effort equal to the happy path',
        evidence: 'Agent systems built without explicit failure handling degraded catastrophically when any component failed — not gracefully. Error propagation was non-linear: one agent failure in a 10-agent chain would typically cause 3-4 additional failures within 2 minutes. Systems with explicitly designed fallback chains isolated failures at the point of origin in 89% of cases.',
        methodology: 'We introduced controlled single-agent failures into production systems with and without explicit failure architecture, measuring how many downstream agents were affected and how long before human intervention was required.',
      },
    ],
    articlesList: [
      {
        slug: 'lessons-from-45-production-agents',
        title: 'Lessons from 45 Production Agents: What We Got Right and What We\'d Change',
        excerpt: 'After building 45 production AI agents across FabricxAI, NEXUS ARIA, and our internal pipeline, here is an honest account of what works, what fails, and what we would do differently.',
        date: 'March 2026',
        readTime: '12 min read',
        tags: ['agents', 'architecture', 'production'],
      },
      {
        slug: 'human-gate-pattern',
        title: 'The Human Gate Pattern: Inserting Human Oversight Without Killing Agent Autonomy',
        excerpt: 'A design pattern for inserting mandatory human approval into automated agent workflows without creating bottlenecks that defeat the purpose of automation.',
        date: 'February 2026',
        readTime: '9 min read',
        tags: ['oversight', 'patterns', 'autonomy'],
      },
      {
        slug: 'when-agents-fail',
        title: 'When Agents Fail: Designing Graceful Degradation in Multi-Agent Architectures',
        excerpt: 'A systematic approach to designing agent systems that fail gracefully. What happens when an agent makes a mistake or encounters an edge case it was not designed for.',
        date: 'January 2026',
        readTime: '14 min read',
        tags: ['failure', 'reliability', 'graceful-degradation'],
      },
      {
        slug: 'memory-architecture-for-long-running-agents',
        title: 'Memory Architecture for Long-Running Agent Systems',
        excerpt: 'How to design memory and state management for AI agents that run for hours or days. Short-term context, long-term memory, and the failure modes of getting it wrong.',
        date: 'December 2025',
        readTime: '13 min read',
        tags: ['memory', 'state', 'architecture'],
      },
    ],
    experimentsList: [
      {
        title: 'Multi-model orchestration: routing by task complexity',
        hypothesis: 'Routing complex reasoning tasks to larger models and simple tasks to smaller, cheaper models should reduce cost without measurable quality loss.',
        status: 'success',
        result: '40% cost reduction with no measurable quality loss across 500 task runs.',
        learning: 'Complexity routing is now a first-class architectural concern. Routing logic based on task type (reasoning vs. retrieval vs. generation) outperformed routing based on input length alone.',
        date: 'February 2026',
      },
      {
        title: 'Autonomous code review: zero human reviewer',
        hypothesis: 'An AI agent with access to linting, static analysis, and semantic review tools can replace human code review for production code.',
        status: 'failed',
        result: 'Agent caught 60% of issues but missed every critical security vulnerability in the test set.',
        learning: 'The 40% it missed included all 12 security vulnerabilities seeded into the test corpus. AI code review is a powerful first-pass tool but cannot replace human security review. We now position it as a complement, not a replacement.',
        date: 'March 2026',
      },
      {
        title: 'FabricxAI initial deployment: 5-agent coordination',
        hypothesis: 'Five coordinating agents can reliably execute a 22-step quality control workflow with less than 2% error rate.',
        status: 'success',
        result: 'Achieved 97.3% task completion rate across 300 production runs in the first month.',
        learning: 'Multi-agent coordination works in production at this scale. The orchestrator-worker pattern proved reliable. The system was later expanded to 22 agents following the same architectural template.',
        date: 'September 2025',
      },
    ],
    whatsNext: [
      {
        title: 'Hierarchical orchestration for 20+ agent systems',
        description: 'We are investigating whether adding a coordination layer between the orchestrator and worker agents improves scalability past 20 agents, or whether it simply shifts the bottleneck.',
      },
      {
        title: 'Cross-session memory persistence with semantic compression',
        description: 'Exploring whether summarising prior session context semantically (rather than truncating) maintains coherence while keeping memory footprints manageable for week-long agent tasks.',
      },
      {
        title: 'Agent-to-agent authentication in untrusted environments',
        description: 'As agent systems become more distributed, verifying that a message claiming to be from an orchestrator is actually from that orchestrator becomes non-trivial. We are testing JWT-based authentication between agents in multi-process deployments.',
      },
    ],
    related: [
      {
        slug: 'applied-ai',
        num: '02',
        title: 'Applied AI',
        question: 'What does AI actually do well — and where does it fail — in real production software?',
      },
      {
        slug: 'developer-tooling',
        num: '03',
        title: 'Developer Tooling',
        question: 'How do we make AI-assisted development workflows faster, safer, and more auditable?',
      },
    ],
  },

  'applied-ai': {
    num: '02',
    title: 'Applied AI',
    question: 'What does AI actually do well — and where does it fail — in real production software?',
    description: [
      'The gap between AI capability in research papers and AI capability inside real production software is larger than most practitioners expect. Models that score impressively on academic benchmarks perform very differently on real documents, real queries, and real user behaviour.',
      'This stream investigates practical AI integration — not what models can theoretically do, but what they reliably do when connected to real data, exposed to real inputs, and asked to operate without a human in the loop to catch mistakes. We focus on document intelligence, structured output extraction, retrieval-augmented generation, and autonomous workflow execution.',
      'The most valuable findings in this stream are the negative ones: places where AI fails in ways that look like success. A model that returns plausible-looking JSON that silently violates the schema. A RAG system that retrieves confidently but retrieves the wrong document. A prompt that worked last month and produces subtly worse output today after a model update nobody announced.',
      'We publish these failure modes because they are predictable, reproducible, and fixable — but only if you know to look for them. The goal is to save practitioners from discovering them the hard way in production.',
    ],
    methodology: {
      overview: 'We test against real document corpora from Studio projects (anonymised) and purpose-built adversarial datasets. No synthetic benchmarks — we test only conditions that reflect how these systems behave in production.',
      types: [
        'Document extraction accuracy testing across clean, semi-structured, and free-form layouts',
        'Schema validation stress testing: seeding deliberate violations and measuring silent failure rates',
        'RAG retrieval quality analysis: measuring precision and recall against gold-standard answer sets',
        'Prompt regression testing: running stable prompts after model updates and measuring output drift',
        'Hallucination rate measurement using self-consistency checking and fact verification against source documents',
      ],
      measurement: 'Primary metrics are accuracy (against ground truth), false confidence rate (wrong answer presented with high confidence), and silent failure rate (technically valid output that violates intended semantics). We track these over time to detect regression after model updates.',
      transparency: 'We document model versions, prompt versions, and dataset characteristics for every experiment. When we discover that a finding changes after a model update, we publish an update to the original finding.',
    },
    status: 'ACTIVE',
    articles: 4,
    experiments: 7,
    findings: [
      {
        title: 'Retrieval quality, not model capability, dominates RAG answer accuracy',
        evidence: 'We ran the same question set against three different models connected to the same retrieval system, then ran the same models against retrieval systems of varying quality. Retrieval quality explained 3x more variance in answer accuracy than model capability. Investing in retrieval quality first is the correct order of priorities for most RAG deployments.',
        methodology: 'We tested 3 models × 4 retrieval configurations on a 200-question evaluation set with ground-truth answers from a real client knowledge base, measuring exact match, semantic similarity, and factual grounding rate.',
      },
      {
        title: 'Structured output extraction fails silently at a higher rate than expected',
        evidence: 'Across 12 production structured extraction pipelines, an average of 11% of model outputs contained schema violations that were not surfaced as errors — they returned as syntactically valid JSON that violated semantic constraints (wrong enum values, plausible-but-incorrect field types, missing required conditional fields). These failures were invisible without explicit validation.',
        methodology: 'We seeded 40 known schema violation patterns into test documents across varying complexity levels and measured what percentage of model outputs violated the schema without triggering a parsing error.',
      },
      {
        title: 'Prompt regression after model updates is real and measurable',
        evidence: 'We maintain a regression suite of 50 stable prompts with expected outputs. Running this suite after 6 model updates over 8 months detected measurable output drift in 4 of 6 updates — in 2 cases, the drift was large enough to break downstream logic in production systems. Model updates are not announced for self-hosted models and are inconsistently documented for hosted APIs.',
        methodology: 'Automated regression suite running against a prompt bank with expected outputs, scored by exact match plus semantic similarity. Threshold for "drift detected" is a 5% or greater change in either metric.',
      },
      {
        title: 'Self-consistency hallucination checking adds 40–60% cost but reduces confident wrong answers by over 80%',
        evidence: 'Across 5 production systems using self-consistency checking (running the same query multiple times and measuring agreement), confident hallucinations — cases where the model provided a definitive wrong answer — dropped by 83% on average. The cost increase of 40–60% is justified for high-stakes outputs but not for routine information retrieval.',
        methodology: 'We ran A/B tests on production query traffic, splitting requests between standard single-pass inference and self-consistency checking (5 independent samples). Confident hallucinations were identified by cross-referencing outputs against verified source documents.',
      },
    ],
    articlesList: [
      {
        slug: 'rag-in-production',
        title: 'RAG in Production: What the Papers Do Not Tell You',
        excerpt: 'Retrieval-augmented generation research uses clean, well-formatted corpora. Real documents are messy. Here is what changes when you move from research to production.',
        date: 'January 2026',
        readTime: '12 min read',
        tags: ['RAG', 'retrieval', 'production'],
      },
      {
        slug: 'structured-output-extraction',
        title: 'Structured Output Extraction: A Practical Guide',
        excerpt: 'Getting consistent JSON out of an LLM sounds trivial and is surprisingly hard. Schemas, retry strategies, confidence scoring, and handling partial failures.',
        date: 'December 2025',
        readTime: '9 min read',
        tags: ['structured-output', 'schemas', 'extraction'],
      },
      {
        slug: 'hallucination-measurement-in-production',
        title: 'Measuring Hallucination in Production RAG Systems',
        excerpt: 'How we detect and measure AI hallucination in production systems — not with academic benchmarks, but with checks that run continuously on live traffic.',
        date: 'November 2025',
        readTime: '10 min read',
        tags: ['hallucination', 'measurement', 'RAG'],
      },
      {
        slug: 'prompt-regression-testing',
        title: 'Prompt Regression Testing: How We Catch Model Updates Before They Reach Production',
        excerpt: 'Model updates happen without announcements. We built a prompt regression suite to detect output drift automatically. Here is how it works and what we have caught.',
        date: 'October 2025',
        readTime: '8 min read',
        tags: ['prompts', 'regression', 'testing'],
      },
    ],
    experimentsList: [
      {
        title: 'Semantic query routing pre-retrieval in RAG pipeline',
        hypothesis: 'Routing queries to the most semantically relevant data source before retrieval will improve answer accuracy more than improving retrieval within a single source.',
        status: 'success',
        result: 'Answer relevance improved 38% on a 200-question evaluation set with no increase in latency.',
        learning: 'Query routing is now a first-class step in every RAG pipeline we build. Routing based on query intent (procedural vs. factual vs. comparative) outperformed routing based on semantic similarity to source descriptions alone.',
        date: 'January 2026',
      },
      {
        title: 'Zero-shot document classification on free-form layouts',
        hypothesis: 'A well-prompted model can classify document types (invoice, contract, report, letter) with >90% accuracy without fine-tuning on domain-specific examples.',
        status: 'partial',
        result: '94% accuracy on structured document types; 61% on free-form layouts without consistent visual structure.',
        learning: 'Zero-shot classification is reliable for templated documents and unreliable for free-form ones. We now use classification confidence to route low-confidence documents to a human-in-the-loop step before downstream processing.',
        date: 'November 2025',
      },
      {
        title: 'Full automation of recurring report generation',
        hypothesis: 'An AI pipeline can generate weekly operational reports from structured data sources with quality indistinguishable from human-written reports.',
        status: 'partial',
        result: 'Quantitative sections were rated equivalent to human-written. Narrative interpretation sections were rated significantly lower on coherence and appropriate emphasis.',
        learning: 'AI is reliable for data-to-text generation when the interpretation rules are explicit. Qualitative analysis that requires judgment about what matters requires human involvement. We now use AI for the data synthesis layer and human editors for the interpretation layer.',
        date: 'October 2025',
      },
    ],
    whatsNext: [
      {
        title: 'Continuous hallucination monitoring on live traffic',
        description: 'Building a lightweight hallucination detector that runs on sampled production traffic and alerts when the rate crosses a threshold — without requiring ground truth labels for every response.',
      },
      {
        title: 'Hybrid retrieval: dense + sparse indexing on real-world document corpora',
        description: 'Testing whether combining vector similarity retrieval with keyword (BM25) retrieval consistently improves recall on the long-tail queries that pure dense retrieval misses.',
      },
    ],
    related: [
      {
        slug: 'agent-architecture',
        num: '01',
        title: 'Agent Architecture',
        question: 'How do you build AI agents that are reliable, observable, and composable in production?',
      },
      {
        slug: 'industry-automation',
        num: '04',
        title: 'Industry Automation',
        question: 'Which vertical-specific business processes are genuinely automatable today, and which are not?',
      },
    ],
  },

  'developer-tooling': {
    num: '03',
    title: 'Developer Tooling',
    question: 'How do we make AI-assisted development workflows faster, safer, and more auditable?',
    description: [
      'AI-assisted development has a tooling problem. The individual coding tools are good. The workflow around them — review, testing, deployment, auditing — has not caught up. Engineers using AI coding tools work faster in isolation and encounter bottlenecks at every handoff point: review, integration, testing, and deployment.',
      'This research stream investigates the full workflow: not just code generation, but everything that happens between generation and production. AI code review, test generation, spec-to-code pipelines, and CI/CD gates that understand the difference between a trivial change and a structural one.',
      'The central finding driving this stream is that AI tooling adoption fails when the tools add work rather than remove it. A code review tool that flags the same issues your linter catches gets disabled within two weeks. A deployment gate that blocks on false positives gets bypassed. The design challenge is building tools that surface the issues AI-generated code specifically introduces — architectural drift, subtle security anti-patterns, missing error paths — without adding friction to the issues already caught by existing tooling.',
      'We release everything we build here as open-source: devbridge-review, agent-harness, and deploy-diff all came out of this stream.',
    ],
    methodology: {
      overview: 'We run adoption studies with real engineering teams in addition to technical accuracy tests. A tool that is technically accurate but unused is a failed tool. We measure both technical performance and sustained adoption rates.',
      types: [
        'Code review accuracy testing: seeding known issues into codebases and measuring detection rate by issue type',
        'False positive measurement: running tools on known-good code and measuring incorrectly flagged issues',
        'Adoption studies: instrumenting tool usage by real engineers over 30-day periods',
        'Spec-to-code quality assessment: measuring architectural coherence of AI-generated code against human-reviewed architecture specs',
        'Test generation coverage analysis: comparing AI-generated test suites against manually written suites on the same codebase',
      ],
      measurement: 'We measure true positive rate, false positive rate, and sustained adoption rate at 7 days, 14 days, and 30 days after tool deployment. False positive rate is weighted more heavily in adoption prediction than true positive rate — engineers tolerate missed issues more readily than noise.',
      transparency: 'We share adoption failure case studies as prominently as success stories. Most published AI tooling research shows accuracy metrics; we also publish the adoption studies where technically accurate tools were abandoned.',
    },
    status: 'ACTIVE',
    articles: 4,
    experiments: 6,
    findings: [
      {
        title: 'AI code review adoption depends on surfacing issues engineers cannot easily catch themselves',
        evidence: 'We instrumented 5 teams over 30 days with AI code review tools. The 2 tools that flagged issues also caught by standard linters were disabled within 14 days by 80% of engineers. The tools that focused exclusively on architectural drift, missing error paths, and security anti-patterns not covered by linting maintained 70%+ daily active usage at 30 days.',
        methodology: 'Tool instrumentation + weekly engineer surveys on usefulness rating over 30 days. Disabled or bypassed tools were treated as adoption failures regardless of technical accuracy.',
      },
      {
        title: 'Spec-to-code pipelines fail at the architecture layer, not the syntax layer',
        evidence: 'We ran 20 spec-to-code experiments where AI generated application code from written specifications. In 17 of 20 cases, the generated code was syntactically correct and passed linting. In 11 of 20, it embedded architectural assumptions that conflicted with the spec — using a shared singleton where the spec implied isolated instances, building synchronous flows where async was required, ignoring multi-tenancy constraints. These issues were not surfaced by any automated check.',
        methodology: 'Two senior engineers reviewed each generated codebase against the original spec, rating architectural fidelity independently. Architectural conflicts were defined as design decisions that would require significant refactoring to align with spec intent.',
      },
      {
        title: 'AI test generation reliably covers happy paths and misses edge cases and security scenarios',
        evidence: 'AI-generated test suites consistently achieved 80–85% line coverage — significantly higher than the 45% average in our pre-AI projects. However, human review found that security-related test scenarios (injection, auth bypass, privilege escalation) were present in AI-generated suites at 12% the rate of human-written suites on the same codebase. Edge case coverage was similarly deficient.',
        methodology: 'We compared AI-generated test suites against manually written suites on 8 matched codebase pairs. Coverage metrics plus manual classification of test types (happy path, error handling, security, edge case) by two reviewers per codebase.',
      },
      {
        title: 'Deployment gates that block on uncertainty reduce incidents more than gates that only flag',
        evidence: 'We A/B tested two deployment gate configurations on real CI/CD pipelines: one that flagged high-risk changes for human review but allowed deployment to proceed, and one that blocked deployment pending human approval on changes above a risk threshold. The blocking configuration reduced production incidents by 67%. The flagging configuration reduced incidents by only 11% — engineers often approved deployments without reviewing the flag.',
        methodology: '90-day A/B test across 4 matched engineering teams on similar codebases. Incident rates normalised by deployment frequency. Incident severity weighted by customer impact rating.',
      },
    ],
    articlesList: [
      {
        slug: 'how-we-review-ai-generated-code',
        title: 'How We Review AI-Generated Code Before It Ships',
        excerpt: 'Our code review process for AI-generated output differs from reviewing human-written code. The failure modes are different, so the review heuristics have to be different too.',
        date: 'January 2026',
        readTime: '10 min read',
        tags: ['code-review', 'process', 'AI-generated'],
      },
      {
        slug: 'ai-code-review-adoption',
        title: 'Why AI Code Review Tools Get Disabled in Two Weeks',
        excerpt: 'We instrumented 5 engineering teams over 30 days. The tools that got disabled all had one thing in common. The ones that survived had one thing in common too.',
        date: 'December 2025',
        readTime: '11 min read',
        tags: ['adoption', 'code-review', 'tooling'],
      },
      {
        slug: 'spec-to-code-architecture-failure',
        title: 'The Architecture Problem in Spec-to-Code Pipelines',
        excerpt: 'AI generates syntactically correct code from specifications. The problem is that correct syntax and correct architecture are not the same thing. Here is what that costs you.',
        date: 'November 2025',
        readTime: '12 min read',
        tags: ['spec-to-code', 'architecture', 'AI-generation'],
      },
      {
        slug: 'deployment-gates-that-work',
        title: 'Deployment Gates That Actually Work: Blocking vs. Flagging',
        excerpt: 'We ran a 90-day experiment on whether deployment gates should block uncertain changes or just flag them. The difference in incident rates was larger than expected.',
        date: 'October 2025',
        readTime: '9 min read',
        tags: ['deployment', 'CI/CD', 'gates'],
      },
    ],
    experimentsList: [
      {
        title: 'AI deployment gate: blocking vs. flagging uncertain changes',
        hypothesis: 'A deployment gate that blocks on high-uncertainty changes will reduce production incidents more than a gate that flags and allows deployment to proceed.',
        status: 'success',
        result: '67% incident reduction with blocking gate vs. 11% with flagging gate over 90 days.',
        learning: 'Flagging without blocking is nearly ineffective — engineers approve the deployment without engaging with the flag. Hard stops force engagement. The key is setting the risk threshold carefully; too sensitive and it becomes a bottleneck.',
        date: 'February 2026',
      },
      {
        title: 'Fully automated PR description generation',
        hypothesis: 'AI can generate pull request descriptions that are as useful to reviewers as human-written descriptions, given access to the diff and commit history.',
        status: 'partial',
        result: 'Descriptions rated equivalent on completeness; significantly lower on context (why the change was made, not just what changed).',
        learning: 'AI reliably describes the what of a change from the diff alone. It cannot infer the why without access to the ticket, conversation history, or the developer\'s intent. We now use AI descriptions as a template that developers fill in with context.',
        date: 'January 2026',
      },
      {
        title: 'Spec-to-architecture generation before code generation',
        hypothesis: 'Inserting a human-reviewed architecture step between spec and code generation will improve architectural coherence of AI-generated code.',
        status: 'success',
        result: 'Architectural conflicts in generated code dropped from 55% of projects to 8% when architecture review was inserted as a mandatory gate.',
        learning: 'Architecture must be specified before code generation, not inferred by the model. This finding is now a core principle of our AI-native development methodology. The gate adds 1–2 days to project timelines but eliminates the expensive architectural rewrites that were consuming 3–5 days in the control group.',
        date: 'November 2025',
      },
    ],
    whatsNext: [
      {
        title: 'AI-native code review training data from real review sessions',
        description: 'We are building a labelled dataset of AI-generated code paired with the issues found in human review, to train a code review model that specifically targets the failure modes of AI-generated code rather than general code quality.',
      },
      {
        title: 'Continuous architecture drift detection',
        description: 'Investigating whether a lightweight analyser can detect when a codebase is drifting from its original architecture document — as happens gradually in long-lived projects — before the drift becomes a refactoring problem.',
      },
      {
        title: 'Test generation with security scenario injection',
        description: 'Testing whether explicitly prompting for security test generation with a taxonomy of attack types produces test coverage comparable to human security engineers.',
      },
    ],
    related: [
      {
        slug: 'agent-architecture',
        num: '01',
        title: 'Agent Architecture',
        question: 'How do you build AI agents that are reliable, observable, and composable in production?',
      },
      {
        slug: 'applied-ai',
        num: '02',
        title: 'Applied AI',
        question: 'What does AI actually do well — and where does it fail — in real production software?',
      },
    ],
  },

  'industry-automation': {
    num: '04',
    title: 'Industry Automation',
    question: 'Which vertical-specific business processes are genuinely automatable today, and which are not?',
    description: [
      'The conversation about industry automation tends toward extremes: either AI will automate everything, or it cannot be trusted with any consequential task. The reality is more nuanced and more useful: there are specific, identifiable characteristics of business processes that determine whether automation is reliable today, not reliable but improving, or fundamentally unsuited to current AI capabilities.',
      'This research stream investigates automation feasibility at the process level across four primary verticals: fintech compliance, legal document processing, operations orchestration, and customer communication. We pick hard problems in specific industries, build automation prototypes, test them against real workloads, and publish what we find — including where we expected automation to work and it did not.',
      'The most consistent finding across all verticals is that the technical problems of automation are usually easier than anticipated, and the surrounding problems — liability, explainability, data quality, change management — are usually harder. An AI that processes documents with 94% accuracy on a clean corpus processes them with 61% accuracy on the messy, non-standardised documents that make up the majority of real business archives.',
      'We work with clients in Studios verticals to run these experiments on real data with appropriate safeguards, then publish generalised findings without client-identifiable information. The goal is to give other practitioners an honest map of the terrain before they invest in automation projects.',
    ],
    methodology: {
      overview: 'We run automation prototypes on real business data from consenting Studio clients, with all client-identifying information anonymised before publication. Real data is essential — synthetic datasets do not capture the messiness that determines whether automation is actually viable.',
      types: [
        'Document processing accuracy benchmarking across clean vs. real-world document quality distributions',
        'End-to-end automation rate measurement: what percentage of cases can be fully automated without human review',
        'Error impact analysis: measuring the downstream business impact of automation errors, not just error rates',
        'Explainability assessment: evaluating whether automation decisions can be explained to regulators, auditors, or end customers',
        'Longitudinal drift monitoring: measuring whether automation accuracy degrades over time as business data patterns shift',
      ],
      measurement: 'We measure automation rate (cases fully handled without human intervention), error rate, error impact, explainability rating, and time-to-process compared to manual baseline. We publish the full distribution, not just the average — a 90% automation rate that fails on the 10% most important cases is not a useful system.',
      transparency: 'We identify clearly when automation is not viable today and explain why. We do not publish cherry-picked results from ideal conditions. Every finding includes the conditions under which it holds and the conditions under which it breaks down.',
    },
    status: 'ACTIVE',
    articles: 3,
    experiments: 5,
    findings: [
      {
        title: 'Document extraction accuracy degrades sharply on non-standard layouts',
        evidence: 'We tested document extraction across a corpus of 2,400 real business documents in 4 categories (invoices, contracts, reports, correspondence). On standardised, templated documents, extraction accuracy averaged 94%. On free-form documents without consistent structure, accuracy dropped to 61% using the same models and prompts. The gap was driven by missing field inference on non-standard layouts, not by OCR or parsing errors.',
        methodology: 'Documents classified by human reviewers as structured (templated) vs. semi-structured vs. free-form. Extraction accuracy measured by field-level match against human-extracted ground truth. Results broken out by layout type to surface the distribution, not just the average.',
      },
      {
        title: 'Customer communication automation without human escalation paths causes disproportionate damage',
        evidence: 'We analysed two client deployments of customer communication automation: one with mandatory human escalation for cases the AI flagged as uncertain, and one where the AI handled all cases without escalation. The no-escalation system handled 85% of inquiries correctly and 15% incorrectly. The customer satisfaction impact of the 15% errors was 4x the positive impact of the 85% successes — negative experiences in customer communication have asymmetric weight. Complaint volume tripled. The mandatory escalation system maintained flat customer satisfaction scores.',
        methodology: 'Customer satisfaction survey data from both deployments over 60 days, normalised by inquiry volume. Complaint rate as secondary metric. Results were consistent across two separate client contexts.',
      },
      {
        title: 'Compliance automation in regulated industries requires explainability as a first-class requirement',
        evidence: '"The AI decided" is not an accepted audit trail in any regulated industry we have worked in. Compliance automation that does not produce an auditable decision log — traceable to specific rules, specific document sections, and specific model outputs — was rejected by compliance officers in all 4 fintech clients we worked with, regardless of accuracy. Explainability is a prerequisite, not a nice-to-have.',
        methodology: 'Structured interviews with compliance officers and legal counsel across 4 client organisations after presenting automation prototypes with varying levels of decision explainability. Decision to adopt was the dependent variable; explainability quality was the primary independent variable.',
      },
      {
        title: 'Workflow automation bottlenecks are almost never technical',
        evidence: 'Across 6 operations automation projects, the automation technology itself was the primary bottleneck in only 1 case. In 5 cases, the primary blockers were data quality issues (inputs not in the expected format or quality range), integration problems (APIs that did not behave as documented), or change management resistance (employees routing around the automation). Technical readiness is necessary but not sufficient.',
        methodology: 'Post-project retrospectives on 6 operations automation engagements, classifying the primary cause of each project delay or failure. Classification performed by two analysts independently with disagreements resolved by discussion.',
      },
    ],
    articlesList: [
      {
        slug: 'fintech-compliance-automation',
        title: 'Fintech Compliance Automation: What We Learned After 6 Months',
        excerpt: 'We spent six months automating compliance workflows for fintech clients. The technical problems were easier than expected. The liability questions were harder.',
        date: 'December 2025',
        readTime: '14 min read',
        tags: ['fintech', 'compliance', 'automation'],
      },
      {
        slug: 'document-extraction-real-world',
        title: 'Document Extraction at Scale: The 94% to 61% Drop',
        excerpt: 'Our document extraction pipelines hit 94% accuracy on clean documents and 61% on free-form documents in the same corpus. Here is what drives that gap and how to close it.',
        date: 'November 2025',
        readTime: '11 min read',
        tags: ['document-extraction', 'accuracy', 'production'],
      },
      {
        slug: 'customer-communication-automation-limits',
        title: 'Where Customer Communication Automation Works and Where It Does Not',
        excerpt: 'We analysed two client deployments with and without human escalation paths. The results were unambiguous and the mechanism was not what we expected.',
        date: 'October 2025',
        readTime: '9 min read',
        tags: ['customer-communication', 'automation', 'escalation'],
      },
    ],
    experimentsList: [
      {
        title: 'Customer service automation without human escalation path',
        hypothesis: 'A customer service AI with high accuracy (>85% on test set) can operate without human escalation without degrading customer satisfaction.',
        status: 'failed',
        result: 'Handled 85% of inquiries correctly. Complaint volume tripled. Customer satisfaction fell sharply.',
        learning: 'Error rate and customer satisfaction impact are not linearly related in customer communication contexts. The damage from a wrongly handled customer complaint is asymmetrically high. Human escalation paths are now mandatory in all customer communication automation we deploy, regardless of accuracy metrics.',
        date: 'November 2025',
      },
      {
        title: 'Automated invoice processing for accounts payable',
        hypothesis: 'AI can automate end-to-end invoice processing (receipt → extraction → validation → approval routing) for standard invoice formats with >95% accuracy.',
        status: 'success',
        result: '96.2% accuracy on standard invoice formats. Processing time reduced from 4 hours to 8 minutes per batch. Human review queue reduced by 78%.',
        learning: 'Invoice processing automation is highly effective for standardised formats. The 3.8% that required human review were consistently non-standard layouts, damaged documents, or invoices with disputed amounts — exactly the cases that benefit most from human judgment.',
        date: 'October 2025',
      },
      {
        title: 'Automated contract clause extraction and risk flagging',
        hypothesis: 'AI can extract standard contract clauses and flag non-standard terms with accuracy sufficient to reduce preliminary legal review time by 50%.',
        status: 'partial',
        result: 'Standard clause extraction at 88% accuracy. Non-standard term flagging at 71% — too low for legal use without human verification of every flagged item.',
        learning: 'Contract AI is useful as a first-pass filter that reduces the volume of material requiring human attention, but not as a replacement for human review on consequential determinations. We now position it as a human-acceleration tool, not an autonomous review system.',
        date: 'September 2025',
      },
    ],
    whatsNext: [
      {
        title: 'Longitudinal drift monitoring in document processing pipelines',
        description: 'Investigating whether document extraction accuracy degrades over time as business document formats evolve, and how to detect and respond to drift without requiring continuous human labelling.',
      },
      {
        title: 'Explainability standards for regulated industry automation',
        description: 'Working with compliance and legal partners to define minimum explainability requirements for AI-automated decisions in fintech and legal contexts — what an audit trail must contain to be acceptable.',
      },
    ],
    related: [
      {
        slug: 'applied-ai',
        num: '02',
        title: 'Applied AI',
        question: 'What does AI actually do well — and where does it fail — in real production software?',
      },
      {
        slug: 'developer-tooling',
        num: '03',
        title: 'Developer Tooling',
        question: 'How do we make AI-assisted development workflows faster, safer, and more auditable?',
      },
    ],
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const STATUS_COLORS: Record<string, string> = { success: '#4DBFA8', partial: '#E8B84D', failed: '#E87070' };
const STATUS_LABELS: Record<string, string> = { success: 'Confirmed', partial: 'Partial result', failed: 'Disproven' };

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.07, ease: EASE },
  }),
};

// ── Styles ────────────────────────────────────────────────────────────────────
const STYLES = `
.rd-page { background: var(--bg); min-height: 100vh; }

/* ── Hero ── */
.rd-hero {
  padding: 140px 32px 72px;
  max-width: 1200px;
  margin: 0 auto;
  border-bottom: 1px solid var(--border);
}
.rd-breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: var(--text-muted, #6B7A9B);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 28px;
}
.rd-breadcrumb a { color: ${A}; text-decoration: none; }
.rd-breadcrumb a:hover { text-decoration: underline; }
.rd-breadcrumb span { color: var(--text-muted, #6B7A9B); }
.rd-hero-top { display: grid; grid-template-columns: 1fr auto; gap: 32px; align-items: start; margin-bottom: 28px; }
@media (max-width: 768px) { .rd-hero-top { grid-template-columns: 1fr; } }
.rd-stream-num {
  font-family: var(--font-mono);
  font-size: 5rem;
  font-weight: 600;
  color: ${A};
  opacity: 0.18;
  line-height: 1;
  letter-spacing: -0.05em;
}
.rd-h1 {
  font-family: var(--font-headline);
  font-size: clamp(2rem, 3.5vw, 2.8rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.08;
  color: var(--text-primary);
  margin: 0 0 8px;
}
.rd-status-row {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 28px;
}
.rd-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 0.63rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #4DBFA8;
  background: rgba(77,191,168,0.08);
  border: 1px solid rgba(77,191,168,0.18);
  border-radius: 999px;
  padding: 4px 12px;
}
.rd-badge::before { content: ''; width: 5px; height: 5px; border-radius: 50%; background: #4DBFA8; }
.rd-stat-pill {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: var(--text-secondary);
  letter-spacing: 0.06em;
}
.rd-stat-pill strong { color: var(--text-primary); font-weight: 600; }
.rd-blockquote {
  border-left: 3px solid ${A};
  padding: 16px 24px;
  background: rgba(123,111,232,0.04);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  margin: 0 0 32px;
}
.rd-blockquote p {
  font-family: var(--font-body);
  font-size: 1.05rem;
  line-height: 1.7;
  color: var(--text-secondary);
  font-style: italic;
  margin: 0;
}
.rd-desc { display: flex; flex-direction: column; gap: 16px; margin-bottom: 0; }
.rd-desc p {
  font-family: var(--font-body);
  font-size: 0.96rem;
  line-height: 1.75;
  color: var(--text-secondary);
  margin: 0;
}

/* ── Sections ── */
.rd-section {
  padding: 72px 32px;
  max-width: 1200px;
  margin: 0 auto;
}
.rd-section-alt { background: var(--bg-2); }
.rd-section-alt .rd-section { padding: 72px 32px; }
.rd-section-wrap { background: var(--bg-2); }

.rd-sec-label {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 500;
  color: ${A};
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.rd-sec-label::before { content: ''; display: block; width: 18px; height: 1.5px; background: ${A}; }
.rd-sec-title {
  font-family: var(--font-headline);
  font-size: clamp(1.4rem, 2vw, 1.8rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text-primary);
  margin: 0 0 36px;
}

/* ── Articles list ── */
.rd-articles { display: flex; flex-direction: column; gap: 2px; }
.rd-article {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 20px;
  align-items: center;
  padding: 22px 24px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: border-color 0.3s ease, background 0.3s ease, transform 0.3s ease;
}
.rd-article:hover { border-color: ${A}; background: var(--bg-card-hover); transform: translateX(4px); }
.rd-article-left { display: flex; flex-direction: column; gap: 8px; }
.rd-article-title {
  font-family: var(--font-headline);
  font-size: 0.98rem;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.01em;
  line-height: 1.35;
}
.rd-article-excerpt {
  font-family: var(--font-body);
  font-size: 0.83rem;
  line-height: 1.6;
  color: var(--text-secondary);
}
.rd-article-meta { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.rd-article-tag {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.07em;
  color: ${A};
  background: rgba(123,111,232,0.08);
  border: 1px solid rgba(123,111,232,0.14);
  border-radius: 3px;
  padding: 2px 7px;
}
.rd-article-date {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  color: var(--text-muted, #6B7A9B);
  letter-spacing: 0.05em;
}
.rd-article-rt {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  color: var(--text-muted, #6B7A9B);
}
.rd-article-arrow { color: ${A}; opacity: 0.7; flex-shrink: 0; }
@media (max-width: 640px) { .rd-article { grid-template-columns: 1fr; } .rd-article-arrow { display: none; } }

/* ── Findings ── */
.rd-findings { display: flex; flex-direction: column; gap: 12px; }
.rd-finding {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
}
.rd-finding-header {
  width: 100%;
  background: none;
  border: none;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  cursor: pointer;
  text-align: left;
  transition: background 0.25s ease;
}
.rd-finding-header:hover { background: var(--bg-card-hover); }
.rd-finding-header.open { background: rgba(123,111,232,0.04); border-bottom: 1px solid rgba(123,111,232,0.1); }
.rd-finding-num {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: ${A};
  letter-spacing: 0.08em;
  flex-shrink: 0;
}
.rd-finding-title {
  font-family: var(--font-headline);
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.01em;
  line-height: 1.35;
  flex: 1;
}
.rd-finding-chevron {
  color: ${A};
  flex-shrink: 0;
  transition: transform 0.3s ease;
}
.rd-finding-chevron.open { transform: rotate(180deg); }
.rd-finding-body {
  overflow: hidden;
  transition: max-height 0.35s cubic-bezier(0.16,1,0.3,1);
}
.rd-finding-inner { padding: 20px 24px; display: flex; flex-direction: column; gap: 16px; }
.rd-finding-label {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${A};
  opacity: 0.7;
  margin-bottom: 4px;
}
.rd-finding-text {
  font-family: var(--font-body);
  font-size: 0.88rem;
  line-height: 1.7;
  color: var(--text-secondary);
  margin: 0;
}
.rd-finding-method {
  background: var(--bg-3, rgba(255,255,255,0.03));
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 14px 16px;
}

/* ── Methodology ── */
.rd-methodology { display: flex; flex-direction: column; gap: 28px; }
.rd-meth-intro {
  font-family: var(--font-body);
  font-size: 0.96rem;
  line-height: 1.75;
  color: var(--text-secondary);
  margin: 0;
}
.rd-meth-block { display: flex; flex-direction: column; gap: 12px; }
.rd-meth-label {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${A};
}
.rd-meth-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
.rd-meth-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  font-family: var(--font-body);
  font-size: 0.87rem;
  line-height: 1.6;
  color: var(--text-secondary);
}
.rd-meth-item::before {
  content: '→';
  color: ${A};
  font-size: 0.82rem;
  flex-shrink: 0;
  margin-top: 2px;
}
.rd-meth-text {
  font-family: var(--font-body);
  font-size: 0.87rem;
  line-height: 1.7;
  color: var(--text-secondary);
  margin: 0;
}

/* ── Experiments ── */
.rd-exps { display: flex; flex-direction: column; gap: 16px; }
.rd-exp {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.rd-exp-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.rd-exp-title {
  font-family: var(--font-headline);
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.01em;
  line-height: 1.3;
}
.rd-exp-badge {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid;
  white-space: nowrap;
  flex-shrink: 0;
}
.rd-exp-hyp {
  font-family: var(--font-body);
  font-size: 0.84rem;
  line-height: 1.65;
  color: var(--text-muted, #6B7A9B);
  font-style: italic;
  border-left: 2px solid rgba(123,111,232,0.2);
  padding-left: 12px;
  margin: 0;
}
.rd-exp-result-label {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted, #6B7A9B);
  margin-bottom: 6px;
}
.rd-exp-result {
  font-family: var(--font-body);
  font-size: 0.88rem;
  line-height: 1.65;
  color: var(--text-secondary);
  margin: 0;
}
.rd-exp-learning {
  background: rgba(123,111,232,0.04);
  border: 1px solid rgba(123,111,232,0.1);
  border-radius: var(--radius-sm);
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.rd-exp-learning-label {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${A};
}
.rd-exp-learning-text {
  font-family: var(--font-body);
  font-size: 0.85rem;
  line-height: 1.65;
  color: var(--text-secondary);
  margin: 0;
}
.rd-exp-date { font-family: var(--font-mono); font-size: 0.62rem; color: var(--text-muted, #6B7A9B); }

/* ── What's next ── */
.rd-next { display: flex; flex-direction: column; gap: 14px; }
.rd-next-item {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-left: 3px solid rgba(123,111,232,0.35);
  border-radius: var(--radius-md);
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.rd-next-title {
  font-family: var(--font-headline);
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}
.rd-next-desc {
  font-family: var(--font-body);
  font-size: 0.85rem;
  line-height: 1.65;
  color: var(--text-secondary);
  margin: 0;
}
.rd-next-cta {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: var(--font-headline);
  font-size: 0.85rem;
  font-weight: 600;
  color: ${A};
  text-decoration: none;
  margin-top: 8px;
  transition: gap 0.2s ease;
}
.rd-next-cta:hover { gap: 11px; }

/* ── Related ── */
.rd-related { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
@media (max-width: 640px) { .rd-related { grid-template-columns: 1fr; } }
.rd-related-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 24px;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: border-color 0.3s ease, background 0.3s ease, transform 0.3s ease;
}
.rd-related-card:hover { border-color: ${A}; background: var(--bg-card-hover); transform: translateY(-3px); }
.rd-related-num {
  font-family: var(--font-mono);
  font-size: 2rem;
  font-weight: 600;
  color: ${A};
  opacity: 0.2;
  line-height: 1;
  letter-spacing: -0.04em;
}
.rd-related-title {
  font-family: var(--font-headline);
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}
.rd-related-q {
  font-family: var(--font-body);
  font-size: 0.82rem;
  line-height: 1.6;
  color: var(--text-secondary);
  margin: 0;
}
.rd-related-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${A};
  margin-top: 4px;
}

@media (max-width: 768px) {
  .rd-hero { padding: 120px 20px 56px; }
  .rd-section { padding: 56px 20px; }
  .rd-stream-num { font-size: 3rem; }
}
`;

// ── Component ─────────────────────────────────────────────────────────────────
export default function ResearchStreamPage() {
  const params = useParams<{ slug: string }>();
  const stream = STREAMS[params.slug];

  if (!stream) notFound();

  const [openFinding, setOpenFinding] = useState<number | null>(0);

  return (
    <>
      <style>{STYLES}</style>
      <div className="rd-page">

        {/* ── Hero ── */}
        <section style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="rd-hero">
            <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.08 } } }}>
              <motion.div className="rd-breadcrumb" variants={fadeUp}>
                <Link href="/labs">Labs</Link>
                <span>/</span>
                <Link href="/labs/research">Research</Link>
                <span>/</span>
                <span style={{ color: A }}>{stream.title}</span>
              </motion.div>

              <motion.div className="rd-hero-top" variants={fadeUp}>
                <div>
                  <div className="rd-stream-num">{stream.num}</div>
                  <h1 className="rd-h1">{stream.title}</h1>
                </div>
              </motion.div>

              <motion.div className="rd-status-row" variants={fadeUp}>
                <span className="rd-badge">{stream.status}</span>
                <span className="rd-stat-pill"><strong>{stream.articles}</strong> articles published</span>
                <span className="rd-stat-pill"><strong>{stream.experiments}</strong> experiments logged</span>
              </motion.div>

              <motion.div className="rd-blockquote" variants={fadeUp}>
                <p>{stream.question}</p>
              </motion.div>

              <motion.div className="rd-desc" variants={fadeUp}>
                {stream.description.map((para, i) => <p key={i}>{para}</p>)}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── Research articles ── */}
        <section style={{ background: 'var(--bg-2)' }}>
          <div className="rd-section">
            <div className="rd-sec-label">Published findings</div>
            <h2 className="rd-sec-title">Research articles</h2>
            <div className="rd-articles">
              {stream.articlesList.map((a, i) => (
                <motion.a
                  key={a.slug}
                  href={`/labs/blog/${a.slug}`}
                  className="rd-article"
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
                  custom={i * 0.5}
                  variants={fadeUp}
                >
                  <div className="rd-article-left">
                    <div className="rd-article-title">{a.title}</div>
                    <div className="rd-article-excerpt">{a.excerpt}</div>
                    <div className="rd-article-meta">
                      {a.tags.slice(0, 3).map((t) => (
                        <span key={t} className="rd-article-tag">{t}</span>
                      ))}
                      <span className="rd-article-date">{a.date}</span>
                      <span className="rd-article-rt">{a.readTime}</span>
                    </div>
                  </div>
                  <div className="rd-article-arrow" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4 10h12M12 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* ── Key findings ── */}
        <section>
          <div className="rd-section">
            <div className="rd-sec-label">What we know so far</div>
            <h2 className="rd-sec-title">Key findings</h2>
            <div className="rd-findings">
              {stream.findings.map((f, i) => (
                <motion.div
                  key={i}
                  className="rd-finding"
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.15 }}
                  custom={i * 0.4}
                  variants={fadeUp}
                >
                  <button
                    className={`rd-finding-header ${openFinding === i ? 'open' : ''}`}
                    onClick={() => setOpenFinding(openFinding === i ? null : i)}
                    aria-expanded={openFinding === i}
                  >
                    <span className="rd-finding-num">Finding {String(i + 1).padStart(2, '0')}</span>
                    <span className="rd-finding-title">{f.title}</span>
                    <span className={`rd-finding-chevron ${openFinding === i ? 'open' : ''}`} aria-hidden="true">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M4.5 6.75L9 11.25l4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </button>
                  <div
                    className="rd-finding-body"
                    style={{ maxHeight: openFinding === i ? '600px' : '0px' }}
                  >
                    <div className="rd-finding-inner">
                      <div>
                        <div className="rd-finding-label">Evidence</div>
                        <p className="rd-finding-text">{f.evidence}</p>
                      </div>
                      <div className="rd-finding-method">
                        <div className="rd-finding-label">Methodology</div>
                        <p className="rd-finding-text">{f.methodology}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Methodology ── */}
        <section style={{ background: 'var(--bg-2)' }}>
          <div className="rd-section">
            <div className="rd-sec-label">How we work</div>
            <h2 className="rd-sec-title">Methodology</h2>
            <div className="rd-methodology">
              <p className="rd-meth-intro">{stream.methodology.overview}</p>

              <div className="rd-meth-block">
                <div className="rd-meth-label">Experiment types</div>
                <ul className="rd-meth-list">
                  {stream.methodology.types.map((t, i) => (
                    <li key={i} className="rd-meth-item">{t}</li>
                  ))}
                </ul>
              </div>

              <div className="rd-meth-block">
                <div className="rd-meth-label">How we measure</div>
                <p className="rd-meth-text">{stream.methodology.measurement}</p>
              </div>

              <div className="rd-meth-block">
                <div className="rd-meth-label">Transparency commitment</div>
                <p className="rd-meth-text">{stream.methodology.transparency}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Experiments ── */}
        <section>
          <div className="rd-section">
            <div className="rd-sec-label">Radical transparency</div>
            <h2 className="rd-sec-title">Experiment log — including the failures</h2>
            <div className="rd-exps">
              {stream.experimentsList.map((e, i) => (
                <motion.div
                  key={i}
                  className="rd-exp"
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.15 }}
                  custom={i * 0.4}
                  variants={fadeUp}
                  style={{
                    borderLeft: e.status === 'failed' ? '3px solid rgba(232,112,112,0.4)' : e.status === 'partial' ? '3px solid rgba(232,184,77,0.4)' : '3px solid rgba(77,191,168,0.4)',
                  }}
                >
                  <div className="rd-exp-header">
                    <div className="rd-exp-title">{e.title}</div>
                    <span
                      className="rd-exp-badge"
                      style={{
                        color: STATUS_COLORS[e.status],
                        borderColor: `${STATUS_COLORS[e.status]}35`,
                        background: `${STATUS_COLORS[e.status]}0D`,
                      }}
                    >
                      {STATUS_LABELS[e.status]}
                    </span>
                  </div>

                  <p className="rd-exp-hyp">Hypothesis: {e.hypothesis}</p>

                  <div>
                    <div className="rd-exp-result-label">Result</div>
                    <p className="rd-exp-result">{e.result}</p>
                  </div>

                  <div className="rd-exp-learning">
                    <div className="rd-exp-learning-label">What we learned</div>
                    <p className="rd-exp-learning-text">{e.learning}</p>
                  </div>

                  <div className="rd-exp-date">{e.date}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── What's next ── */}
        <section style={{ background: 'var(--bg-2)' }}>
          <div className="rd-section">
            <div className="rd-sec-label">Active investigations</div>
            <h2 className="rd-sec-title">What we are working on next</h2>
            <div className="rd-next">
              {stream.whatsNext.map((n, i) => (
                <motion.div
                  key={i}
                  className="rd-next-item"
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
                  custom={i * 0.5}
                  variants={fadeUp}
                >
                  <div className="rd-next-title">{n.title}</div>
                  <p className="rd-next-desc">{n.description}</p>
                </motion.div>
              ))}
            </div>
            <Link href="/labs/experiments" className="rd-next-cta" style={{ marginTop: 24 }}>
              Browse all experiments
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </section>

        {/* ── Related streams ── */}
        <section>
          <div className="rd-section">
            <div className="rd-sec-label">Research streams</div>
            <h2 className="rd-sec-title">Related streams</h2>
            <div className="rd-related">
              {stream.related.map((r, i) => (
                <motion.a
                  key={r.slug}
                  href={`/labs/research/${r.slug}`}
                  className="rd-related-card"
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
                  custom={i * 0.5}
                  variants={fadeUp}
                >
                  <div className="rd-related-num">{r.num}</div>
                  <div className="rd-related-title">{r.title}</div>
                  <p className="rd-related-q">{r.question}</p>
                  <span className="rd-related-link" aria-hidden="true">
                    Read research →
                  </span>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
