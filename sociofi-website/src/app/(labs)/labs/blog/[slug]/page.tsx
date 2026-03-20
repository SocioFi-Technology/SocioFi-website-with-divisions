import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

// ── Constants ──────────────────────────────────────────────────────────────────

const A = '#7B6FE8';

// ── Types ──────────────────────────────────────────────────────────────────────

type Stream = 'agent-architecture' | 'applied-ai' | 'developer-tooling' | 'industry-automation';

interface Section {
  type: 'h2' | 'p' | 'code' | 'table' | 'ul';
  content?: string;
  lang?: string;
  headers?: string[];
  rows?: string[][];
  items?: string[];
}

interface RelatedArticle {
  slug: string;
  title: string;
  stream: Stream;
  readTime: number;
}

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  stream: Stream;
  date: string;
  readTime: number;
  author: 'arifur' | 'kamrul';
  tags: string[];
  sections: Section[];
  takeaways: string[];
  related: RelatedArticle[];
}

// ── Stream labels ─────────────────────────────────────────────────────────────

const STREAM_LABELS: Record<Stream, string> = {
  'agent-architecture': 'Agent Architecture',
  'applied-ai': 'Applied AI',
  'developer-tooling': 'Developer Tooling',
  'industry-automation': 'Industry Automation',
};

// ── Authors ───────────────────────────────────────────────────────────────────

const AUTHORS = {
  arifur: { name: 'Arifur Rahman', role: 'CEO, SocioFi Technology · BUET' },
  kamrul: { name: 'Kamrul Hasan', role: 'CTO, SocioFi Technology · BUET' },
};

// ── Article data ──────────────────────────────────────────────────────────────

const ARTICLES: Article[] = [
  {
    slug: 'why-multi-agent-systems-fail-at-scale',
    title: 'Why Multi-Agent Systems Fail at Scale',
    excerpt: 'Multi-agent systems look elegant in architecture diagrams. In production, they develop failure modes that are difficult to reproduce, nearly impossible to debug, and expensive to fix.',
    stream: 'agent-architecture',
    date: '2026-03-15',
    readTime: 14,
    author: 'kamrul',
    tags: ['multi-agent', 'reliability', 'production'],
    takeaways: [
      'Agent coordination overhead scales non-linearly — two agents do not produce twice the throughput of one',
      'The most common failure mode is conflicting state: two agents writing to the same resource without coordination',
      'Tool failure propagation must be explicit — agents that fail silently cause downstream corruption, not visible errors',
      'Circuit breakers and dead-letter queues are not optional infrastructure; they are required for production reliability',
    ],
    sections: [
      {
        type: 'p',
        content: 'We have been running multi-agent systems in production for clients across fintech, logistics, and content operations for the past two years. The systems range from simple two-agent pipelines to orchestration graphs with twelve concurrent specialized agents. In that time, we have accumulated a clear picture of where these architectures break — and most of the failures follow recognizable patterns.',
      },
      {
        type: 'h2',
        content: 'The coordination overhead problem',
      },
      {
        type: 'p',
        content: 'The first thing that surprises teams building their first multi-agent system is that two agents are not twice as fast as one. Coordination has a cost. Agents must share state, synchronize writes, wait for dependencies, and handle partial failures from peers. On small workloads this cost is negligible. At scale — thousands of concurrent tasks, tight latency budgets, or complex dependency graphs — coordination overhead can consume more resources than the agents\' actual work.',
      },
      {
        type: 'p',
        content: 'The scaling curve is roughly O(n log n) for well-designed coordination, and O(n²) for naive designs where every agent talks to every other agent directly. The critical design decision is minimizing the coordination surface: which agents need to know about which other agents, and what is the minimum shared state required?',
      },
      {
        type: 'h2',
        content: 'Conflicting state: the most common failure mode',
      },
      {
        type: 'p',
        content: 'In our post-mortems, conflicting writes to shared state account for roughly 40% of production incidents in multi-agent systems. Two agents are processing different inputs that happen to reference the same downstream resource — a database record, a file, a third-party API with rate limits — and they write conflicting updates within milliseconds of each other. One update wins. The other is silently overwritten or causes a constraint violation that surfaces hours later in a seemingly unrelated operation.',
      },
      {
        type: 'p',
        content: 'The fix is not optimistic locking or retry logic — those are mitigations, not solutions. The real fix is being explicit about which agents are allowed to write to which resources, and routing conflicting operations through a single coordinator agent responsible for that resource class. This feels like over-engineering until you have dealt with your first corrupted dataset at 3am.',
      },
      {
        type: 'h2',
        content: 'Tool failure propagation',
      },
      {
        type: 'p',
        content: 'When a tool call fails in a single-agent system, the failure is visible: the agent reports it, the calling code can handle it, and the error propagates cleanly up the call stack. In multi-agent systems, tool failures are more insidious. Agent A calls a tool that returns a malformed response. Agent A treats this as a partial success. Agent B receives Agent A\'s output, which contains subtle errors. Agent B\'s output is now also subtly wrong. By the time the corruption is visible, it is three steps downstream from the original failure.',
      },
      {
        type: 'p',
        content: 'We require all tool calls in our agent systems to be typed against a strict schema, and all agents to treat schema violations as hard failures rather than warnings. This is more disruptive in the short term — more visible errors, more manual intervention — but it prevents the silent corruption pattern that is far harder to diagnose and fix.',
      },
      {
        type: 'h2',
        content: 'Infrastructure requirements you cannot skip',
      },
      {
        type: 'p',
        content: 'Teams that are new to multi-agent systems often treat circuit breakers and dead-letter queues as optional infrastructure for later. They are not. A circuit breaker that stops an agent from hammering a failing downstream service is essential from day one. A dead-letter queue that captures failed tasks for later review is the only way to ensure you are not silently losing work. These components take a day to add at the start of a project and weeks to retrofit into a running system.',
      },
    ],
    related: [
      { slug: 'tool-use-reliability-six-month-benchmark', title: 'Tool Use Reliability: Our 6-Month Benchmark', stream: 'agent-architecture', readTime: 18 },
      { slug: 'memory-systems-for-long-running-agents', title: 'Memory Systems for Long-Running Agents', stream: 'agent-architecture', readTime: 12 },
      { slug: 'building-a-spec-to-code-pipeline-that-actually-works', title: 'Building a Spec-to-Code Pipeline That Actually Works', stream: 'developer-tooling', readTime: 20 },
    ],
  },
  {
    slug: 'tool-use-reliability-six-month-benchmark',
    title: 'Tool Use Reliability: Our 6-Month Benchmark',
    excerpt: 'We ran structured reliability benchmarks on tool-calling behavior across six months and three production systems. Raw accuracy mattered less than how agents handled failures.',
    stream: 'agent-architecture',
    date: '2026-02-20',
    readTime: 18,
    author: 'kamrul',
    tags: ['benchmarks', 'tool-use', 'reliability'],
    takeaways: [
      'Tool call accuracy on well-defined, unambiguous tasks is high — typically above 92% in our benchmark suite',
      'Accuracy degrades sharply when tool schemas are ambiguous or tool descriptions overlap in meaning',
      'How an agent handles a failed tool call matters more than baseline accuracy for overall system reliability',
      'Structured retry logic with exponential backoff and fallback tools outperforms simple retry-until-success',
    ],
    sections: [
      {
        type: 'p',
        content: 'For the past six months, we have been running a continuous benchmark suite against three production systems that rely heavily on tool use. The goal was not to generate a headline accuracy number — it was to understand the specific conditions under which tool use reliability degrades, and what engineering decisions have the largest impact on real-world reliability.',
      },
      {
        type: 'h2',
        content: 'Benchmark methodology',
      },
      {
        type: 'p',
        content: 'Each benchmark run consists of 500 tasks drawn from a fixed distribution across tool categories: data retrieval, write operations, computation, and multi-step chains. Tasks are scored on first-attempt accuracy, recovery rate (did the agent eventually succeed after failures?), and silent failure rate (did the agent report success when it actually failed?). We run the suite weekly and store all results for trend analysis.',
      },
      {
        type: 'table',
        headers: ['Tool Category', 'First-Attempt Accuracy', 'Recovery Rate', 'Silent Failure Rate'],
        rows: [
          ['Data retrieval', '96.2%', '98.8%', '0.4%'],
          ['Write operations', '91.4%', '94.1%', '2.3%'],
          ['Computation', '94.7%', '97.2%', '0.8%'],
          ['Multi-step chains', '83.1%', '87.6%', '4.1%'],
        ],
      },
      {
        type: 'h2',
        content: 'What actually affects reliability',
      },
      {
        type: 'p',
        content: 'The single largest driver of reliability variance in our benchmark was tool schema quality, not model capability. When we wrote tool schemas with precise parameter descriptions, unambiguous type definitions, and clear examples of valid input, accuracy on those tools was consistently above 94%. When schemas had vague descriptions, optional parameters without defaults, or overlapping semantics with adjacent tools, accuracy dropped to the 78-85% range — regardless of which underlying model we were using.',
      },
      {
        type: 'p',
        content: 'The second largest factor was how agents handle failures. Systems with explicit failure handling — structured retry logic, fallback tools, and hard limits on retry depth — had overall task success rates 8-12 percentage points higher than systems that relied on the agent to figure out recovery on its own. The agent\'s ad-hoc recovery behavior is unpredictable and often makes things worse.',
      },
      {
        type: 'h2',
        content: 'The silent failure problem',
      },
      {
        type: 'p',
        content: 'The metric we track most closely is silent failure rate: cases where the agent reports a successful tool call but the underlying operation either did not happen or produced incorrect output. At 4.1% for multi-step chains, this is high enough to cause real problems in production systems. A 1-in-25 chance of your agent confidently reporting success on an operation that failed is not acceptable in financial or operational contexts.',
      },
      {
        type: 'p',
        content: 'Our mitigation is output verification: every tool call result is validated against an expected schema before the agent proceeds. This adds latency (typically 50-150ms per tool call), but it eliminates silent failures. For most production contexts, this tradeoff is worth it.',
      },
      {
        type: 'h2',
        content: 'Recommendations',
      },
      {
        type: 'p',
        content: 'Based on six months of data: invest disproportionately in tool schema quality before optimizing anything else. Run your own accuracy benchmarks on the specific tools and task types your system uses — generic benchmarks will not predict your actual production numbers. Build explicit failure handling into your orchestration layer rather than relying on the agent to self-recover. And measure silent failures specifically; they are the most dangerous and the easiest to miss.',
      },
    ],
    related: [
      { slug: 'why-multi-agent-systems-fail-at-scale', title: 'Why Multi-Agent Systems Fail at Scale', stream: 'agent-architecture', readTime: 14 },
      { slug: 'memory-systems-for-long-running-agents', title: 'Memory Systems for Long-Running Agents', stream: 'agent-architecture', readTime: 12 },
    ],
  },
  {
    slug: 'memory-systems-for-long-running-agents',
    title: 'Memory Systems for Long-Running Agents',
    excerpt: 'Agents that run for more than a few turns degrade in predictable ways. We built and tested four memory architectures to understand what actually works for long-running agent sessions.',
    stream: 'agent-architecture',
    date: '2025-12-08',
    readTime: 12,
    author: 'kamrul',
    tags: ['memory', 'context', 'long-running'],
    takeaways: [
      'Context window degradation is predictable: agent output quality begins declining after 60-70% context utilization',
      'Hierarchical summarization outperforms raw truncation for maintaining coherence in long sessions',
      'Working memory (in-context) plus episodic memory (vector search) plus procedural memory (static instructions) is the most effective three-layer architecture',
      'Memory retrieval latency matters — budgeting 200-400ms for memory lookup prevents it from dominating agent response time',
    ],
    sections: [
      {
        type: 'p',
        content: 'Every agent architecture works well for a few turns. The problems start around turn 15-20, when the context window is partially filled, earlier instructions have been compressed or truncated, and the agent starts making mistakes that would not happen in a fresh session. We tested four different memory architectures to understand which approaches maintain agent quality over sessions of 50-100 turns.',
      },
      {
        type: 'h2',
        content: 'The four architectures we tested',
      },
      {
        type: 'p',
        content: 'Architecture 1 (baseline) was simple rolling truncation: keep the most recent N tokens and discard the rest. Architecture 2 was hierarchical summarization: periodically compress older conversation history into a summary that replaces the original turns. Architecture 3 was external memory with vector retrieval: store all history externally and retrieve relevant context before each turn. Architecture 4 was a three-layer hybrid: working memory (current turn context), episodic memory (vector search over past turns), and procedural memory (static instructions that never change).',
      },
      {
        type: 'table',
        headers: ['Architecture', 'Task Success at Turn 20', 'Task Success at Turn 50', 'Latency Overhead'],
        rows: [
          ['Rolling truncation', '88%', '71%', '< 10ms'],
          ['Hierarchical summarization', '91%', '82%', '80-150ms'],
          ['External vector memory', '89%', '85%', '150-300ms'],
          ['Three-layer hybrid', '93%', '89%', '200-400ms'],
        ],
      },
      {
        type: 'h2',
        content: 'Why the hybrid wins',
      },
      {
        type: 'p',
        content: 'The three-layer hybrid architecture consistently outperformed the others for one key reason: it separates concerns cleanly. Working memory handles immediate context. Episodic memory handles "what happened earlier in this session that is relevant to the current task." Procedural memory handles "what are the standing instructions and constraints that always apply." Each layer uses the storage and retrieval mechanism appropriate to its function.',
      },
      {
        type: 'p',
        content: 'The failure mode of simpler architectures is that they try to do everything with one mechanism. Rolling truncation is fast but loses important early context. Hierarchical summarization compresses context but loses detail. External vector memory provides comprehensive recall but retrieves everything through the same mechanism regardless of information type. The hybrid avoids these by matching mechanism to information type.',
      },
      {
        type: 'h2',
        content: 'Practical implementation notes',
      },
      {
        type: 'p',
        content: 'The latency overhead of the three-layer hybrid (200-400ms) is not trivial. For interactive agents where users expect sub-second responses, this is a significant cost. Our recommendation is to make memory retrieval asynchronous where possible: start retrieving episodic context while processing the current input, so retrieval happens in parallel with understanding, not in sequence.',
      },
      {
        type: 'p',
        content: 'Episodic memory retrieval quality also depends heavily on the embedding model and chunking strategy. We use sentence-level chunks for agent conversation history rather than token-level chunks, and we store structured metadata alongside embeddings so that retrieval can filter by turn number, topic, and agent role. This reduces noise in retrieval significantly.',
      },
    ],
    related: [
      { slug: 'why-multi-agent-systems-fail-at-scale', title: 'Why Multi-Agent Systems Fail at Scale', stream: 'agent-architecture', readTime: 14 },
      { slug: 'tool-use-reliability-six-month-benchmark', title: 'Tool Use Reliability: Our 6-Month Benchmark', stream: 'agent-architecture', readTime: 18 },
    ],
  },
  {
    slug: 'llm-accuracy-in-production-what-benchmarks-dont-tell-you',
    title: "LLM Accuracy in Production: What the Benchmarks Don't Tell You",
    excerpt: 'Academic benchmarks measure accuracy on clean tasks. Production has ambiguous queries, contradictory context, and real-world document noise. Here is what we actually measure.',
    stream: 'applied-ai',
    date: '2026-03-01',
    readTime: 16,
    author: 'kamrul',
    tags: ['benchmarks', 'accuracy', 'production'],
    takeaways: [
      'Published benchmark scores have a weak correlation with production accuracy on most business tasks',
      'Query ambiguity, document noise, and context contradictions are the three main failure drivers in production that benchmarks do not test',
      'Building a small, domain-specific evaluation set is more useful than any published benchmark for predicting your production performance',
      'Human-in-the-loop review on a random 5% sample of outputs is the most reliable signal for ongoing accuracy monitoring',
    ],
    sections: [
      {
        type: 'p',
        content: 'When a client asks us which model to use for their document processing pipeline, they often open with "I saw that Model X scored 89% on [some benchmark]. Is that good?" The honest answer is: we do not know, and neither does anyone else without testing it on your specific data and queries. Published benchmarks are not useless — they tell you something about general capability — but they have systematic gaps that matter in production.',
      },
      {
        type: 'h2',
        content: 'What benchmarks test vs. what production requires',
      },
      {
        type: 'p',
        content: 'Academic benchmarks are designed with clear, unambiguous tasks, clean ground truth labels, and single-hop reasoning. They test whether a model can answer a question that has one correct answer, given context that is sufficient and non-contradictory. This is a useful property to test, but it is not what most production systems encounter.',
      },
      {
        type: 'p',
        content: 'In our document processing work, the three most common production failure patterns are: (1) query ambiguity — the user asks a question that has multiple valid interpretations, and the model picks one without asking for clarification; (2) document noise — OCR artifacts, formatting inconsistencies, and mixed-language text cause the model to misread key facts; and (3) context contradiction — when two documents in the retrieval context say different things about the same fact, the model picks one without flagging the conflict.',
      },
      {
        type: 'h2',
        content: 'Building a useful evaluation set',
      },
      {
        type: 'p',
        content: 'The most useful investment for any production AI system is a small, domain-specific evaluation set of 200-500 examples that reflect the actual distribution of your production queries and documents. This takes time to build — it requires real examples, real ground truth labels, and coverage of the edge cases that matter to your business. But it predicts your production performance far more reliably than any published benchmark.',
      },
      {
        type: 'p',
        content: 'Include at minimum: 30-40 examples of ambiguous queries that require clarification, 30-40 examples of noisy or poorly formatted documents, 20-30 examples where the correct answer is "I don\'t know" or "the documents disagree," and 100+ examples of straightforward tasks from your core use case. Run this evaluation set every time you change models, change prompts, or change retrieval configuration.',
      },
      {
        type: 'h2',
        content: 'Ongoing production monitoring',
      },
      {
        type: 'p',
        content: 'Automated accuracy monitoring is limited by the fact that you often do not know the ground truth for a given query until after the fact. Our practical approach is human-in-the-loop review of a random 5% sample of all outputs, with structured scoring against a rubric. This is expensive in human time, but it provides a continuous ground-truth signal that automated metrics cannot replicate. For most production systems, this 5% sample is sufficient to detect accuracy regressions within one business week of a change.',
      },
      {
        type: 'h2',
        content: 'The model selection decision',
      },
      {
        type: 'p',
        content: 'Given all of this, how do you choose a model for production? Our process: start with the top 2-3 options by benchmark score in the relevant capability category. Run each against your domain-specific evaluation set. Measure accuracy, latency, and cost at your expected query volume. Eliminate any model that shows systematic failure on your most important query types. From the remainder, choose based on cost and latency. Revisit the decision every 3-4 months as new models release.',
      },
    ],
    related: [
      { slug: 'prompt-engineering-is-engineering', title: 'Prompt Engineering Is Engineering', stream: 'applied-ai', readTime: 10 },
      { slug: 'rag-vs-fine-tuning-the-wrong-question', title: 'RAG vs Fine-Tuning: The Wrong Question', stream: 'applied-ai', readTime: 11 },
    ],
  },
  {
    slug: 'prompt-engineering-is-engineering',
    title: 'Prompt Engineering Is Engineering',
    excerpt: 'The term "prompt engineering" implies a soft skill between copywriting and magic. It is not. It is a systems engineering problem with measurable inputs, testable outputs, and real failure modes.',
    stream: 'applied-ai',
    date: '2025-11-14',
    readTime: 10,
    author: 'kamrul',
    tags: ['prompting', 'engineering', 'methodology'],
    takeaways: [
      'Prompts are specifications — they should be written, versioned, and tested with the same rigor as code',
      'The three most common prompt failures are underspecification, overly broad instructions, and missing failure-mode handling',
      'A/B testing prompts on a fixed evaluation set is essential before shipping any prompt change to production',
      'System prompts and user prompts have different failure modes and should be treated as separate engineering artifacts',
    ],
    sections: [
      {
        type: 'p',
        content: 'When we do code reviews at SocioFi, we review prompts with the same rigor as code. We look for underspecification, missing error handling, ambiguous instructions, and edge cases that the prompt does not address. We version prompts in git. We run evaluation suites before every prompt change. We treat a prompt regression — where a prompt change degrades accuracy on a previously passing test case — with the same urgency as a code regression.',
      },
      {
        type: 'h2',
        content: 'Prompts as specifications',
      },
      {
        type: 'p',
        content: 'A prompt is a specification for model behavior. Like any specification, it can be complete or incomplete, ambiguous or precise, robust or brittle. An underspecified prompt is one that does not tell the model what to do in the cases that matter — not just the happy path. An ambiguous prompt is one that can be interpreted in multiple ways, leading to inconsistent behavior. A brittle prompt is one that breaks when the input format changes slightly.',
      },
      {
        type: 'p',
        content: 'Writing a good prompt follows the same discipline as writing a good function signature: specify the inputs, specify the expected outputs, specify what should happen when inputs are invalid or unexpected, and include examples for non-obvious cases. A prompt that says "extract the key facts from this document" will produce inconsistent results. A prompt that specifies exactly which facts to extract, what format to return them in, and what to return when the document is missing a fact will produce consistent, testable results.',
      },
      {
        type: 'h2',
        content: 'The three most common prompt failures',
      },
      {
        type: 'p',
        content: 'Underspecification is the most common: the prompt does not address the cases that matter, so the model improvises. Overly broad instructions are the second: "be helpful and accurate" is not an instruction, it is a wish. The third is missing failure-mode handling: what should the model do when the input is ambiguous, when the document is missing required information, when there are conflicting facts? If the prompt does not specify, the model will make something up.',
      },
      {
        type: 'h2',
        content: 'Testing prompts before shipping them',
      },
      {
        type: 'p',
        content: 'Every prompt that goes into production at SocioFi goes through a fixed evaluation suite first. The suite covers the happy path, edge cases, adversarial inputs, and the specific failure modes we have seen in production. A prompt change that improves performance on one case but degrades it on another requires a justification before it ships — just like a code change that fixes one bug but introduces another.',
      },
      {
        type: 'code',
        content: `// Example: structured prompt evaluation in TypeScript
const results = await evaluatePrompt({
  prompt: newSystemPrompt,
  cases: evaluationSuite,
  scoringFn: (expected, actual) => {
    const parsed = parseStructuredOutput(actual);
    return compareFields(expected, parsed, { strict: true });
  },
  threshold: 0.92, // fail if accuracy drops below 92%
});

if (results.accuracy < results.baseline - 0.02) {
  throw new Error(\`Prompt regression: \${results.accuracy} vs baseline \${results.baseline}\`);
}`,
        lang: 'typescript',
      },
    ],
    related: [
      { slug: 'llm-accuracy-in-production-what-benchmarks-dont-tell-you', title: "LLM Accuracy in Production: What the Benchmarks Don't Tell You", stream: 'applied-ai', readTime: 16 },
      { slug: 'rag-vs-fine-tuning-the-wrong-question', title: 'RAG vs Fine-Tuning: The Wrong Question', stream: 'applied-ai', readTime: 11 },
    ],
  },
  {
    slug: 'rag-vs-fine-tuning-the-wrong-question',
    title: 'RAG vs Fine-Tuning: The Wrong Question',
    excerpt: 'Declaring RAG or fine-tuning "better" misses the point. The real question is what problem you are actually solving. Here is a framework for making the decision.',
    stream: 'applied-ai',
    date: '2025-10-02',
    readTime: 11,
    author: 'kamrul',
    tags: ['RAG', 'fine-tuning', 'architecture'],
    takeaways: [
      'RAG and fine-tuning solve different problems — comparing their performance directly is usually a category error',
      'RAG is appropriate when the information you need changes frequently or is too large to encode in weights',
      'Fine-tuning is appropriate when you need to change behavior patterns, response format, or specialized reasoning — not to add factual knowledge',
      'Many production systems benefit from both, applied at different layers for different purposes',
    ],
    sections: [
      {
        type: 'p',
        content: 'The "RAG vs. fine-tuning" debate recurs every few months with a new study, usually framed as one technique decisively defeating the other. These studies are mostly comparing the wrong things. RAG and fine-tuning address different failure modes. Using fine-tuning to add knowledge and RAG to change behavior will produce poor results regardless of which is "better" in the abstract.',
      },
      {
        type: 'h2',
        content: 'What each technique actually does',
      },
      {
        type: 'p',
        content: 'Fine-tuning adjusts the weights of a model — it changes how the model reasons, how it formats output, and what behavioral patterns it applies. It does not reliably add new factual knowledge; research consistently shows that fine-tuned models still hallucinate facts that were not in the pre-training data, even if similar facts appear in fine-tuning examples. Fine-tuning is appropriate for behavior modification: teaching the model to respond in a specific format, to apply domain-specific reasoning patterns, or to adopt a particular tone.',
      },
      {
        type: 'p',
        content: 'RAG (retrieval-augmented generation) provides the model with relevant information at inference time. It is appropriate when the information is too large to encode in model weights, when it changes frequently, or when the model needs access to specific documents or records that did not exist during training. RAG does not change model behavior — it changes what the model knows in a given context.',
      },
      {
        type: 'h2',
        content: 'A decision framework',
      },
      {
        type: 'table',
        headers: ['Problem Type', 'Recommended Approach', 'Rationale'],
        rows: [
          ['Model gives wrong format/tone', 'Fine-tuning', 'Behavior change, not knowledge change'],
          ['Model lacks domain knowledge', 'RAG', 'Knowledge changes over time; store it externally'],
          ['Model needs to answer from specific docs', 'RAG', 'Documents are too large or too dynamic for weights'],
          ['Model applies wrong reasoning pattern', 'Fine-tuning', 'Reasoning patterns live in weights, not context'],
          ['High accuracy + consistent format + fresh data', 'Both', 'Format via fine-tuning, knowledge via RAG'],
        ],
      },
      {
        type: 'h2',
        content: 'When to use both',
      },
      {
        type: 'p',
        content: 'Several of our production systems use both techniques at different layers. We fine-tune base models to produce output in a consistent, structured format that our downstream processing can parse reliably. We use RAG to provide those models with current, accurate information relevant to each query. The fine-tuned model handles format and behavior; the RAG pipeline handles knowledge. They are not competing approaches — they are complementary tools solving different problems.',
      },
    ],
    related: [
      { slug: 'prompt-engineering-is-engineering', title: 'Prompt Engineering Is Engineering', stream: 'applied-ai', readTime: 10 },
      { slug: 'llm-accuracy-in-production-what-benchmarks-dont-tell-you', title: "LLM Accuracy in Production: What the Benchmarks Don't Tell You", stream: 'applied-ai', readTime: 16 },
    ],
  },
  {
    slug: 'building-a-spec-to-code-pipeline-that-actually-works',
    title: 'Building a Spec-to-Code Pipeline That Actually Works',
    excerpt: 'We spent six months building a spec-to-code pipeline. The naive version works 40% of the time. The version we ship works reliably. Here is what changed.',
    stream: 'developer-tooling',
    date: '2026-02-05',
    readTime: 20,
    author: 'kamrul',
    tags: ['spec-to-code', 'pipeline', 'automation'],
    takeaways: [
      'Spec ambiguity is the single largest failure mode — the pipeline breaks where the specification has gaps',
      'Breaking specs into smaller, independently testable units dramatically improves overall reliability',
      'Human review at the specification stage (before code generation) prevents more errors than review at the code stage',
      'The pipeline must include a test generation step — untested generated code will have production failure rates above 15%',
    ],
    sections: [
      {
        type: 'p',
        content: 'When we started building our spec-to-code pipeline internally, the first prototype looked like it worked: feed in a natural language specification, get out functional code. On demos it was impressive. In production testing against a fixed suite of realistic engineering tasks, it succeeded about 40% of the time. After six months of iteration, that number is above 85%. Here is an honest account of what changed.',
      },
      {
        type: 'h2',
        content: 'The spec ambiguity problem',
      },
      {
        type: 'p',
        content: 'The naive assumption is that the pipeline fails because code generation is unreliable. Code generation is actually the part that works. The pipeline fails where the specification has gaps — places where a human engineer would ask a clarifying question, but the pipeline has to make an assumption. Every ambiguity in the spec becomes a decision point in the generated code, and wrong decisions compound: a wrong data type in step 3 causes incorrect behavior in step 8.',
      },
      {
        type: 'p',
        content: 'The first major improvement was adding a spec validation step before code generation. The validation step uses a separate model to identify ambiguities, underspecified requirements, and missing edge case handling. When ambiguities are found, the pipeline either requests clarification (in interactive mode) or flags them in a review queue (in batch mode). This single change improved first-pass success rate from 40% to 64%.',
      },
      {
        type: 'h2',
        content: 'Decomposition and modular generation',
      },
      {
        type: 'p',
        content: 'The second improvement was spec decomposition. Instead of generating an entire feature from one large specification, we decompose specs into independently testable units — roughly one unit per function or small module. Each unit has a clear input/output contract that can be verified independently. This prevents the error-compounding problem and makes it possible to retry and regenerate individual units without regenerating the whole feature.',
      },
      {
        type: 'code',
        content: `// Spec decomposition: one unit per testable function
interface SpecUnit {
  id: string;
  description: string;
  inputs: TypedParam[];
  outputs: TypedParam[];
  constraints: string[];
  testCases: TestCase[];
}

async function decomposeSpec(spec: string): Promise<SpecUnit[]> {
  const decomposed = await callModel({
    task: 'decompose-spec',
    spec,
    outputSchema: SpecUnitArraySchema,
  });
  // Validate each unit has sufficient test coverage
  return decomposed.filter(unit => unit.testCases.length >= 3);
}`,
        lang: 'typescript',
      },
      {
        type: 'h2',
        content: 'The test generation requirement',
      },
      {
        type: 'p',
        content: 'Generated code without tests has production failure rates above 15% in our testing — far too high for anything customer-facing. We made test generation a required step, not an optional one. The pipeline generates tests from the spec unit contracts before generating the implementation. If the generated implementation does not pass the generated tests, the pipeline retries with the test failures as additional context. Tests generated from specs are not perfect, but they catch the most common implementation errors.',
      },
      {
        type: 'h2',
        content: 'Where human review still adds value',
      },
      {
        type: 'p',
        content: 'Human engineers in our process review at two stages: spec validation (before code generation) and integration testing (after all units pass their unit tests). The spec review catches requirement-level errors that the automated validation misses. The integration review catches behavioral errors that emerge from unit interactions — things that pass unit tests but fail in the assembled system. We have not found a reliable automated substitute for either review stage.',
      },
    ],
    related: [
      { slug: 'ai-code-review-where-it-helps-where-it-lies', title: 'AI Code Review: Where It Helps, Where It Lies', stream: 'developer-tooling', readTime: 13 },
      { slug: 'testing-ai-generated-code-at-scale', title: 'Testing AI-Generated Code at Scale', stream: 'developer-tooling', readTime: 15 },
    ],
  },
  {
    slug: 'ai-code-review-where-it-helps-where-it-lies',
    title: 'AI Code Review: Where It Helps, Where It Lies',
    excerpt: 'AI code review is useful for some categories of bugs and actively misleading for others. After a year of integration, here is what we know.',
    stream: 'developer-tooling',
    date: '2025-12-22',
    readTime: 13,
    author: 'kamrul',
    tags: ['code-review', 'tooling', 'reliability'],
    takeaways: [
      'AI review is reliable for: missing error handling, obvious security anti-patterns, style violations, and documentation gaps',
      'AI review is unreliable for: subtle business logic errors, performance implications at scale, and security vulnerabilities that require context beyond the file',
      'False positives are a larger practical problem than false negatives — reviewers that cry wolf get ignored',
      'Configure AI review tools to report only high-confidence findings; reduce noise ruthlessly',
    ],
    sections: [
      {
        type: 'p',
        content: 'We have been running AI code review in our engineering process for over a year — on client codebases, our own tools, and generated code from our pipelines. The experience has clarified exactly where AI review adds value and where it confidently flags non-issues or misses real problems. The pattern is consistent enough that we can configure our review tools around it.',
      },
      {
        type: 'h2',
        content: 'Where AI review is reliable',
      },
      {
        type: 'p',
        content: 'AI code review is reliably accurate for four categories: missing error handling (the most common catch), obvious security anti-patterns like hardcoded credentials or SQL injection vectors in simple patterns, style and convention violations against a defined standard, and documentation gaps. These are the categories where the review can make a confident assessment from local code context — no understanding of business logic or system architecture required.',
      },
      {
        type: 'p',
        content: 'We run AI review in our CI pipeline specifically for these four categories. The false positive rate in these categories is below 8%, which is low enough that engineers take the findings seriously rather than dismissing them as noise.',
      },
      {
        type: 'h2',
        content: 'Where AI review is unreliable',
      },
      {
        type: 'p',
        content: 'The categories where AI review produces misleading results: subtle business logic errors (requires understanding requirements, not just code), performance implications at scale (requires understanding data volumes and query patterns), and security vulnerabilities that require cross-file or cross-service context. In these categories, the false positive rate in our testing is above 35%, and the false negative rate — critical issues the review misses — is above 25%.',
      },
      {
        type: 'p',
        content: 'The false positive problem is worse in practice than the numbers suggest. A reviewer that flags business logic issues with 35% accuracy trains engineers to ignore its findings, which then also trains them to ignore the findings in categories where it is 92% accurate. The tool that cries wolf is worse than no tool at all.',
      },
      {
        type: 'h2',
        content: 'Configuring for signal over noise',
      },
      {
        type: 'p',
        content: 'Our configuration for AI review tools: enable only the categories where accuracy is high, set confidence thresholds so that borderline findings are suppressed, and never report findings that require architectural or business logic context. This sounds conservative, but a review tool with a 5% false positive rate that engineers trust is more valuable than a comprehensive tool with a 30% false positive rate that engineers ignore.',
      },
    ],
    related: [
      { slug: 'building-a-spec-to-code-pipeline-that-actually-works', title: 'Building a Spec-to-Code Pipeline That Actually Works', stream: 'developer-tooling', readTime: 20 },
      { slug: 'testing-ai-generated-code-at-scale', title: 'Testing AI-Generated Code at Scale', stream: 'developer-tooling', readTime: 15 },
    ],
  },
  {
    slug: 'testing-ai-generated-code-at-scale',
    title: 'Testing AI-Generated Code at Scale',
    excerpt: 'Testing AI-generated code is not the same as testing human-written code. The failure modes are different, and standard TDD does not map cleanly to a workflow where code arrives pre-written.',
    stream: 'developer-tooling',
    date: '2025-09-18',
    readTime: 15,
    author: 'kamrul',
    tags: ['testing', 'quality', 'ai-generated-code'],
    takeaways: [
      'AI-generated code has systematic failure patterns — the same error types recur across different models and prompts',
      'Mutation testing is more effective than coverage metrics for evaluating test suite quality on generated code',
      'Property-based testing catches more generated-code failures per test than example-based testing',
      'A dedicated test generation step (separate from code generation) produces better test suites than asking the code generator to write its own tests',
    ],
    sections: [
      {
        type: 'p',
        content: 'The testing literature assumes a human wrote the code being tested. The mental model is: a developer writes code, a test suite catches regressions. With AI-generated code, both the code and potentially the tests are generated artifacts. The failure modes are different. The places where bugs hide are different. And the standard TDD advice — write tests first, then code — does not map cleanly to a workflow where the code arrives pre-written.',
      },
      {
        type: 'h2',
        content: 'Systematic failure patterns in generated code',
      },
      {
        type: 'p',
        content: 'After reviewing thousands of AI-generated code artifacts, we have identified the categories of errors that appear with disproportionate frequency: boundary condition handling (off-by-one errors, empty input handling, null/undefined handling), error propagation (errors caught and swallowed rather than propagated), implicit assumptions about input format, and race conditions in async code. These are not random bugs — they are systematic. Any test suite for generated code should explicitly test against these categories.',
      },
      {
        type: 'h2',
        content: 'Why coverage metrics fail',
      },
      {
        type: 'p',
        content: 'High line coverage on AI-generated code provides a false sense of security. Generated code often includes explicit happy-path branches that tests naturally exercise, but the subtle failure modes — the ones that matter — are in the implicit behavior around those branches. We shifted to mutation testing as our primary quality metric for generated code: we introduce small mutations into the code and check whether the test suite detects them. A test suite that fails to detect mutations is not testing the behavior that matters, regardless of coverage percentage.',
      },
      {
        type: 'h2',
        content: 'Property-based testing for generated code',
      },
      {
        type: 'p',
        content: 'Property-based testing — writing tests that assert behavioral invariants and letting the framework generate test cases — is disproportionately effective for generated code. It exercises the boundary conditions and edge cases that example-based tests miss, without requiring the test author to anticipate every specific edge case. For any generated function with non-trivial input handling, we write at minimum one property-based test per behavioral invariant. The investment pays off quickly.',
      },
      {
        type: 'code',
        content: `// Property-based test example using fast-check
import fc from 'fast-check';

test('parseInvoice: total always equals sum of line items', () => {
  fc.assert(
    fc.property(
      fc.array(
        fc.record({ amount: fc.float({ min: 0, max: 100000 }), qty: fc.integer({ min: 1, max: 1000 }) }),
        { minLength: 1, maxLength: 20 }
      ),
      (lineItems) => {
        const invoice = parseInvoice({ lineItems });
        const expected = lineItems.reduce((sum, item) => sum + item.amount * item.qty, 0);
        return Math.abs(invoice.total - expected) < 0.01;
      }
    )
  );
});`,
        lang: 'typescript',
      },
    ],
    related: [
      { slug: 'building-a-spec-to-code-pipeline-that-actually-works', title: 'Building a Spec-to-Code Pipeline That Actually Works', stream: 'developer-tooling', readTime: 20 },
      { slug: 'ai-code-review-where-it-helps-where-it-lies', title: 'AI Code Review: Where It Helps, Where It Lies', stream: 'developer-tooling', readTime: 13 },
    ],
  },
  {
    slug: 'the-40-percent-automation-threshold',
    title: 'The 40% Automation Threshold',
    excerpt: 'Processes where AI handles 40%+ of cases reliably are worth automating. Below that, the overhead of routing, reviewing, and correcting AI output typically exceeds the savings.',
    stream: 'industry-automation',
    date: '2026-01-18',
    readTime: 12,
    author: 'arifur',
    tags: ['automation', 'ROI', 'decision-framework'],
    takeaways: [
      'The breakeven point for most automation projects is around 40% AI-handled volume — below this, human oversight costs exceed savings',
      'Error costs, not just volume, determine whether automation is worth it — high-consequence errors shift the threshold significantly',
      'Routing quality (correctly identifying which cases AI can handle vs. which need human review) is as important as AI accuracy',
      'Start with a pilot of 200-500 cases before committing to full automation; real-world distribution always differs from assumptions',
    ],
    sections: [
      {
        type: 'p',
        content: 'After automating dozens of business processes across document handling, customer inquiry routing, compliance checking, and operational monitoring, we have developed a rule of thumb that holds up consistently: automation is cost-effective when AI can handle at least 40% of incoming cases reliably, without human review. Below that threshold, the overhead of routing decisions, review queues, and correction workflows typically exceeds the savings from automation.',
      },
      {
        type: 'h2',
        content: 'The math behind the threshold',
      },
      {
        type: 'p',
        content: 'Consider a process where a human handles 100 cases per day at 4 minutes each. Total: 400 minutes, or about one full-time person. An AI system that handles 40% of cases automatically and routes the remaining 60% to humans, with a 2% error rate requiring correction, reduces human handling to roughly 63 cases per day (60 routed + ~3 error corrections). That is a 37% reduction in human time — enough to justify the engineering and maintenance costs for most processes.',
      },
      {
        type: 'p',
        content: 'Below 40%, the math inverts. If AI handles only 25% of cases, humans still handle 78+ cases per day. The engineering overhead of building, maintaining, and monitoring the automation system plus the added latency of the routing layer costs more than the savings from the 22 cases the AI handles. You have added complexity without adding value.',
      },
      {
        type: 'h2',
        content: 'How error costs change the threshold',
      },
      {
        type: 'p',
        content: 'The 40% threshold assumes average-consequence errors. For processes where an AI error has high downstream cost — financial transactions, compliance decisions, customer-facing communications for high-value accounts — the threshold shifts higher. We use a simple cost-weighted formula: multiply your expected error rate by the average cost of an error in your domain. If that product exceeds $X per day (where X is your target daily savings from automation), the project does not make financial sense at current AI accuracy levels.',
      },
      {
        type: 'h2',
        content: 'The routing quality problem',
      },
      {
        type: 'p',
        content: 'The most underrated factor in automation ROI is routing quality: how reliably the system identifies which cases it can handle versus which it should route to humans. Poor routing (sending AI-solvable cases to humans, or vice versa) destroys efficiency in both directions. We measure routing precision and recall separately from AI accuracy, and we treat routing quality as a first-class metric in any automation project.',
      },
      {
        type: 'p',
        content: 'The best routing systems we have built use a confidence threshold calibrated on holdout data, not the default confidence of the underlying model. Model confidence scores are often miscalibrated — a model that reports 90% confidence may have 70% actual accuracy at that threshold. We recalibrate on domain-specific data before setting the routing threshold for any production system.',
      },
    ],
    related: [
      { slug: 'document-processing-what-structured-ai-gets-right', title: 'Document Processing: What Structured AI Gets Right', stream: 'industry-automation', readTime: 14 },
      { slug: 'when-to-automate-a-decision-framework', title: 'When to Automate: A Decision Framework', stream: 'industry-automation', readTime: 9 },
    ],
  },
  {
    slug: 'document-processing-what-structured-ai-gets-right',
    title: 'Document Processing: What Structured AI Gets Right',
    excerpt: 'After processing millions of documents across industries, we understand exactly where structured AI excels, where it struggles, and what production failure modes look like.',
    stream: 'industry-automation',
    date: '2025-11-30',
    readTime: 14,
    author: 'arifur',
    tags: ['document-processing', 'structured-output', 'production'],
    takeaways: [
      'Structured fields (dates, amounts, identifiers) are extracted with very high accuracy — often above 97% on clean documents',
      'Accuracy degrades rapidly with document quality: OCR artifacts, mixed layouts, and multi-language content each cost 5-15 percentage points',
      'Semantic understanding of document intent (not just field extraction) is still unreliable for novel document types',
      'A hybrid architecture — structured extraction for known fields, language model for semantic tasks — outperforms a pure language model approach for most business document types',
    ],
    sections: [
      {
        type: 'p',
        content: 'Business document processing was one of the first automation opportunities we pursued seriously. Invoices, purchase orders, contracts, insurance forms, shipping manifests — these documents have high volume, consistent structure, and clear value if processed accurately. After processing millions of documents for clients in logistics, finance, and legal services, we have a detailed picture of where AI excels and where it needs human backup.',
      },
      {
        type: 'h2',
        content: 'What AI gets right',
      },
      {
        type: 'p',
        content: 'Structured field extraction from well-formatted documents is the strong suit. Dates, monetary amounts, identifiers (invoice numbers, PO numbers, account codes), addresses, and named entities can be extracted with accuracy above 97% from clean digital documents. For documents with consistent layouts from known issuers, accuracy is often above 99%. This is the category where AI processing genuinely replaces human data entry without meaningful quality loss.',
      },
      {
        type: 'table',
        headers: ['Document Type', 'Field Extraction Accuracy (Clean)', 'Field Extraction Accuracy (Scanned)'],
        rows: [
          ['Digital invoices', '98.4%', '94.1%'],
          ['Purchase orders', '97.9%', '92.7%'],
          ['Insurance claims', '96.2%', '88.3%'],
          ['Legal contracts', '94.8%', '85.9%'],
          ['Handwritten forms', '91.3%', '76.4%'],
        ],
      },
      {
        type: 'h2',
        content: 'Where document quality degrades accuracy',
      },
      {
        type: 'p',
        content: 'Document quality is the largest driver of accuracy variance. OCR artifacts from low-quality scans, mixed language content, non-standard layouts, and handwritten annotations each cost 5-15 percentage points of accuracy. These quality issues are not evenly distributed — in most enterprise document pipelines, 15-25% of incoming documents have at least one significant quality issue. Your real-world accuracy will be a weighted average of clean-document and degraded-document performance.',
      },
      {
        type: 'h2',
        content: 'The hybrid architecture that works',
      },
      {
        type: 'p',
        content: 'For most business document processing, we use a hybrid architecture: a structured extraction layer handles known fields with high confidence and low latency, and a language model handles semantic tasks — summarization, anomaly flagging, cross-document comparison — that require natural language understanding. Running a language model over every field extraction is expensive and unnecessary. Running a structured extractor over semantic tasks does not work. Matching the tool to the task is what produces the best accuracy-to-cost ratio.',
      },
    ],
    related: [
      { slug: 'the-40-percent-automation-threshold', title: 'The 40% Automation Threshold', stream: 'industry-automation', readTime: 12 },
      { slug: 'when-to-automate-a-decision-framework', title: 'When to Automate: A Decision Framework', stream: 'industry-automation', readTime: 9 },
    ],
  },
  {
    slug: 'when-to-automate-a-decision-framework',
    title: 'When to Automate: A Decision Framework',
    excerpt: 'Not every business process should be automated. We developed a framework based on measurable criteria that helps teams make this decision rationally — not based on enthusiasm or fear.',
    stream: 'industry-automation',
    date: '2025-08-25',
    readTime: 9,
    author: 'arifur',
    tags: ['automation', 'framework', 'decision-making'],
    takeaways: [
      'Automate processes that have high volume, low variability, and clear quality criteria — not because AI can do them, but because the economics make sense',
      'The four questions that drive the decision: volume, variability, error cost, and maintenance overhead',
      'Pilot before committing: a 200-500 case pilot will reveal real-world distribution and failure modes that desk research misses',
      'Automation is not binary — partial automation with human-in-the-loop review is the right answer for many processes',
    ],
    sections: [
      {
        type: 'p',
        content: 'We have declined to automate processes that clients were eager to hand over to AI. The reasons were always the same: the economics did not work, the failure modes were too costly, or the variability in the real-world data was too high for current AI reliability. Our decision framework is a set of four questions, each of which must have a satisfactory answer before we recommend automation.',
      },
      {
        type: 'h2',
        content: 'The four questions',
      },
      {
        type: 'p',
        content: 'Question 1: What is the volume? Automation requires engineering effort and ongoing maintenance. Below roughly 50 cases per day, the cost of a well-built automation system rarely pays off within a reasonable timeframe. Exceptions exist — very high error-cost or high-skill processes — but volume is usually the first filter.',
      },
      {
        type: 'p',
        content: 'Question 2: What is the variability? Processes where 80%+ of cases follow a consistent pattern are good automation candidates. Processes where every case is substantially different require more sophisticated AI and more ongoing tuning. High variability shifts the threshold — you need higher volume to justify the additional engineering.',
      },
      {
        type: 'p',
        content: 'Question 3: What is the cost of an error? For low-consequence errors (a misformatted report, a routing mistake that gets corrected in the next step), high AI error rates are acceptable. For high-consequence errors (a missed compliance flag, an incorrect financial transaction), you need near-perfect accuracy before automating fully. Map your error cost explicitly before committing to automation.',
      },
      {
        type: 'p',
        content: 'Question 4: What is the maintenance overhead? AI systems require ongoing monitoring, retraining as data distribution shifts, and updates when upstream data formats change. A process that changes frequently or has highly variable inputs will require substantially more maintenance than a stable, high-volume process. Factor this into your ROI calculation.',
      },
      {
        type: 'h2',
        content: 'Why partial automation is often the right answer',
      },
      {
        type: 'p',
        content: 'Full automation — AI handles everything without human review — is appropriate only when AI accuracy is very high (above 97%) and error costs are low. For most real-world processes, partial automation is more appropriate: AI handles the straightforward cases automatically, and a human reviews the edge cases and low-confidence predictions. This hybrid approach typically captures 60-80% of the efficiency gains from full automation while maintaining the quality guarantees that full automation cannot yet provide.',
      },
      {
        type: 'h2',
        content: 'The pilot requirement',
      },
      {
        type: 'p',
        content: 'We require a pilot of at least 200 real cases before committing to full automation for any client. The pilot exposes the actual distribution of case types (always different from what teams describe), the actual failure modes (often different from what teams predict), and the actual quality of upstream data (usually worse than expected). A pilot that reveals a process is not ready for automation has saved the client money, not wasted it.',
      },
    ],
    related: [
      { slug: 'the-40-percent-automation-threshold', title: 'The 40% Automation Threshold', stream: 'industry-automation', readTime: 12 },
      { slug: 'document-processing-what-structured-ai-gets-right', title: 'Document Processing: What Structured AI Gets Right', stream: 'industry-automation', readTime: 14 },
    ],
  },
];

// ── Static params + metadata ──────────────────────────────────────────────────

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) return {};
  return {
    title: `${article.title} — SocioFi Labs`,
    description: article.excerpt,
    openGraph: {
      title: `${article.title} — SocioFi Labs`,
      description: article.excerpt,
      type: 'article',
    },
  };
}

// ── Styles ────────────────────────────────────────────────────────────────────

const STYLES = `
  .article-page {
    background: var(--bg);
    min-height: 100vh;
  }
  .article-header {
    padding-top: calc(var(--space-section) + 60px);
    padding-bottom: 64px;
    background: var(--bg);
    border-bottom: 1px solid var(--border);
    position: relative;
    overflow: hidden;
  }
  .article-header-bg {
    position: absolute;
    top: -200px;
    right: -200px;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, color-mix(in srgb, ${A} 8%, transparent) 0%, transparent 70%);
    pointer-events: none;
  }
  .article-container {
    max-width: 760px;
    margin: 0 auto;
    padding: 0 32px;
  }
  .article-breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 28px;
  }
  .article-breadcrumb a {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${A};
    text-decoration: none;
    transition: opacity 0.2s;
  }
  .article-breadcrumb a:hover {
    opacity: 0.7;
  }
  .article-breadcrumb-sep {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    color: var(--text-muted);
  }
  .article-stream-tag {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${A};
    background: color-mix(in srgb, ${A} 10%, transparent);
    border: 1px solid color-mix(in srgb, ${A} 20%, transparent);
    padding: 3px 9px;
    border-radius: 100px;
  }
  .article-meta-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
    flex-wrap: wrap;
  }
  .article-meta-sep {
    color: var(--text-muted);
    font-size: 0.8rem;
  }
  .article-meta-text {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    color: var(--text-muted);
  }
  .article-h1 {
    font-family: var(--font-headline);
    font-size: clamp(1.9rem, 4vw, 2.8rem);
    font-weight: 800;
    letter-spacing: -0.04em;
    line-height: 1.1;
    color: var(--text-primary);
    margin-bottom: 28px;
  }
  .article-author-row {
    display: flex;
    align-items: center;
    gap: 14px;
    padding-top: 24px;
    border-top: 1px solid var(--border);
  }
  .author-avatar {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: color-mix(in srgb, ${A} 12%, transparent);
    border: 1.5px solid color-mix(in srgb, ${A} 25%, transparent);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-headline);
    font-size: 0.8rem;
    font-weight: 600;
    color: ${A};
    flex-shrink: 0;
  }
  .author-name {
    font-family: var(--font-headline);
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-primary);
    letter-spacing: -0.01em;
    margin-bottom: 2px;
  }
  .author-role {
    font-family: var(--font-body);
    font-size: 0.78rem;
    color: var(--text-muted);
  }
  .author-date {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--text-muted);
    margin-left: auto;
  }
  .article-body {
    padding: 64px 0;
    background: var(--bg);
  }
  .prose-h2 {
    font-family: var(--font-headline);
    font-size: 1.4rem;
    font-weight: 700;
    letter-spacing: -0.025em;
    line-height: 1.25;
    color: var(--text-primary);
    margin-top: 48px;
    margin-bottom: 16px;
  }
  .prose-h2:first-child {
    margin-top: 0;
  }
  .prose-p {
    font-family: var(--font-body);
    font-size: 1rem;
    line-height: 1.78;
    color: var(--text-secondary);
    margin-bottom: 20px;
  }
  .prose-code {
    font-family: var(--font-mono);
    font-size: 0.82rem;
    line-height: 1.8;
    color: var(--text-primary);
    background: var(--bg-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 24px 28px;
    overflow-x: auto;
    margin: 28px 0;
    display: block;
    white-space: pre;
  }
  .prose-table-wrap {
    overflow-x: auto;
    margin: 28px 0;
  }
  .prose-table {
    width: 100%;
    border-collapse: collapse;
    font-family: var(--font-body);
    font-size: 0.88rem;
  }
  .prose-table th {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-muted);
    text-align: left;
    padding: 10px 16px;
    border-bottom: 1px solid var(--border);
  }
  .prose-table td {
    padding: 12px 16px;
    color: var(--text-secondary);
    border-bottom: 1px solid var(--border);
    line-height: 1.5;
  }
  .prose-table tr:last-child td {
    border-bottom: none;
  }
  .prose-table tr:nth-child(even) td {
    background: color-mix(in srgb, var(--bg-2) 50%, transparent);
  }
  .prose-ul {
    margin: 20px 0;
    padding-left: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .prose-li {
    font-family: var(--font-body);
    font-size: 1rem;
    line-height: 1.7;
    color: var(--text-secondary);
    padding-left: 20px;
    position: relative;
  }
  .prose-li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 12px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${A};
  }
  .takeaways-box {
    background: color-mix(in srgb, ${A} 8%, var(--bg-card));
    border: 1px solid color-mix(in srgb, ${A} 20%, transparent);
    border-left: 3px solid ${A};
    border-radius: var(--radius-md);
    padding: 28px 32px;
    margin: 40px 0;
  }
  .takeaways-label {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${A};
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .takeaway-item {
    display: flex;
    gap: 12px;
    margin-bottom: 10px;
  }
  .takeaway-item:last-child {
    margin-bottom: 0;
  }
  .takeaway-bullet {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${A};
    flex-shrink: 0;
    margin-top: 9px;
  }
  .takeaway-text {
    font-family: var(--font-body);
    font-size: 0.92rem;
    line-height: 1.65;
    color: var(--text-primary);
  }
  .newsletter-strip {
    padding: 48px 0;
    background: var(--bg-2);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }
  .newsletter-strip-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 32px;
  }
  .newsletter-strip-heading {
    font-family: var(--font-headline);
    font-size: 1.2rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--text-primary);
    margin-bottom: 4px;
  }
  .newsletter-strip-sub {
    font-family: var(--font-body);
    font-size: 0.88rem;
    color: var(--text-secondary);
    margin: 0;
  }
  .newsletter-strip-form {
    display: flex;
    gap: 10px;
    flex-shrink: 0;
  }
  .newsletter-strip-input {
    font-family: var(--font-body);
    font-size: 0.88rem;
    padding: 10px 18px;
    border-radius: 100px;
    border: 1.5px solid var(--border);
    background: var(--bg);
    color: var(--text-primary);
    outline: none;
    width: 200px;
    transition: border-color 0.2s;
  }
  .newsletter-strip-input:focus {
    border-color: ${A};
  }
  .newsletter-strip-input::placeholder {
    color: var(--text-muted);
  }
  .newsletter-strip-btn {
    font-family: var(--font-headline);
    font-size: 0.84rem;
    font-weight: 600;
    padding: 10px 22px;
    border-radius: 100px;
    border: none;
    background: ${A};
    color: #fff;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }
  .newsletter-strip-btn:hover {
    background: #9187f0;
    transform: translateY(-2px);
  }
  .related-section {
    padding: 80px 0;
    background: var(--bg);
  }
  .related-heading {
    font-family: var(--font-headline);
    font-size: 1.1rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--text-primary);
    margin-bottom: 24px;
  }
  .related-list {
    display: flex;
    flex-direction: column;
  }
  .related-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    padding: 18px 0;
    border-bottom: 1px solid var(--border);
    text-decoration: none;
    transition: all 0.2s var(--ease);
  }
  .related-row:first-child {
    border-top: 1px solid var(--border);
  }
  .related-row:hover .related-row-title {
    color: ${A};
  }
  .related-row-stream {
    font-family: var(--font-mono);
    font-size: 0.62rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${A};
    display: block;
    margin-bottom: 4px;
  }
  .related-row-title {
    font-family: var(--font-headline);
    font-size: 0.95rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    line-height: 1.3;
    color: var(--text-primary);
    transition: color 0.2s;
  }
  .related-row-meta {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    color: var(--text-muted);
    white-space: nowrap;
    flex-shrink: 0;
  }
  @media (max-width: 768px) {
    .article-container {
      padding: 0 20px;
    }
    .newsletter-strip-inner {
      flex-direction: column;
      align-items: flex-start;
    }
    .newsletter-strip-form {
      width: 100%;
      flex-direction: column;
    }
    .newsletter-strip-input {
      width: 100%;
    }
    .newsletter-strip-btn {
      width: 100%;
      text-align: center;
    }
    .author-date {
      display: none;
    }
  }
`;

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function initials(name: string) {
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function LabsBlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) notFound();

  const author = AUTHORS[article.author];

  return (
    <div className="article-page">
      <style>{STYLES}</style>

      {/* ── Article Header ────────────────────────────────────────────────── */}
      <header className="article-header">
        <div className="article-header-bg" aria-hidden="true" />
        <div className="article-container">
          {/* Breadcrumb */}
          <nav className="article-breadcrumb" aria-label="Breadcrumb">
            <Link href="/labs/blog">Labs Blog</Link>
            <span className="article-breadcrumb-sep">/</span>
            <span className="article-stream-tag">{STREAM_LABELS[article.stream]}</span>
          </nav>

          {/* Meta */}
          <div className="article-meta-row">
            <span className="article-stream-tag">{STREAM_LABELS[article.stream]}</span>
            <span className="article-meta-sep">·</span>
            <span className="article-meta-text">{article.readTime} min read</span>
          </div>

          {/* Title */}
          <h1 className="article-h1">{article.title}</h1>

          {/* Author */}
          <div className="article-author-row">
            <div className="author-avatar" aria-hidden="true">
              {initials(author.name)}
            </div>
            <div>
              <div className="author-name">{author.name}</div>
              <div className="author-role">{author.role}</div>
            </div>
            <div className="author-date">{formatDate(article.date)}</div>
          </div>
        </div>
      </header>

      {/* ── Article Body ──────────────────────────────────────────────────── */}
      <main className="article-body" id="main-content">
        <div className="article-container">
          {/* Key Takeaways */}
          <div className="takeaways-box">
            <div className="takeaways-label">Key takeaways</div>
            {article.takeaways.map((t, i) => (
              <div key={i} className="takeaway-item">
                <div className="takeaway-bullet" aria-hidden="true" />
                <p className="takeaway-text">{t}</p>
              </div>
            ))}
          </div>

          {/* Article sections */}
          {article.sections.map((section, i) => {
            if (section.type === 'h2') {
              return <h2 key={i} className="prose-h2">{section.content}</h2>;
            }
            if (section.type === 'p') {
              return <p key={i} className="prose-p">{section.content}</p>;
            }
            if (section.type === 'code') {
              return (
                <pre key={i} className="prose-code">
                  <code>{section.content}</code>
                </pre>
              );
            }
            if (section.type === 'table' && section.headers && section.rows) {
              return (
                <div key={i} className="prose-table-wrap">
                  <table className="prose-table">
                    <thead>
                      <tr>
                        {section.headers.map((h, j) => (
                          <th key={j}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.rows.map((row, j) => (
                        <tr key={j}>
                          {row.map((cell, k) => (
                            <td key={k}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            }
            if (section.type === 'ul' && section.items) {
              return (
                <ul key={i} className="prose-ul">
                  {section.items.map((item, j) => (
                    <li key={j} className="prose-li">{item}</li>
                  ))}
                </ul>
              );
            }
            return null;
          })}
        </div>
      </main>

      {/* ── Newsletter strip ──────────────────────────────────────────────── */}
      <section className="newsletter-strip">
        <div className="article-container">
          <div className="newsletter-strip-inner">
            <div>
              <div className="newsletter-strip-heading">Get the research, not the noise.</div>
              <p className="newsletter-strip-sub">
                New articles from the Labs team. Published when there is something worth saying.
              </p>
            </div>
            <form
              className="newsletter-strip-form"
              action="/contact"
              method="get"
              aria-label="Newsletter signup"
            >
              <input
                type="email"
                className="newsletter-strip-input"
                placeholder="your@email.com"
                aria-label="Email address"
                required
              />
              <button type="submit" className="newsletter-strip-btn">Subscribe</button>
            </form>
          </div>
        </div>
      </section>

      {/* ── Related articles ──────────────────────────────────────────────── */}
      {article.related.length > 0 && (
        <section className="related-section">
          <div className="article-container">
            <h2 className="related-heading">Keep reading</h2>
            <nav className="related-list" aria-label="Related articles">
              {article.related.map((rel) => (
                <Link key={rel.slug} href={`/labs/blog/${rel.slug}`} className="related-row">
                  <div>
                    <span className="related-row-stream">{STREAM_LABELS[rel.stream]}</span>
                    <span className="related-row-title">{rel.title}</span>
                  </div>
                  <span className="related-row-meta">{rel.readTime} min read</span>
                </Link>
              ))}
            </nav>
          </div>
        </section>
      )}
    </div>
  );
}
