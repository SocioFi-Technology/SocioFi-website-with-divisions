'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// ─── Constants ────────────────────────────────────────────────────────────────
const A = '#7B6FE8';
const F = {
  h: "var(--font-manrope,'Manrope'),sans-serif",
  b: "var(--font-dm-sans,'DM Sans'),sans-serif",
  m: "var(--font-jb-mono,'JetBrains Mono'),monospace",
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const STYLES = `
  .comp-page { background: var(--bg); min-height: 100vh; }

  /* Hero */
  .comp-hero { padding: 148px 0 100px; position: relative; overflow: hidden; }
  .comp-hero-bg { position: absolute; inset: 0; pointer-events: none; }
  .comp-hero-orb { position: absolute; border-radius: 50%; filter: blur(110px); }
  .comp-hero-orb-1 { width: 700px; height: 500px; background: radial-gradient(circle, rgba(123,111,232,0.07) 0%, transparent 70%); top: -150px; right: -200px; }
  .comp-hero-orb-2 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(85,72,176,0.05) 0%, transparent 70%); bottom: -100px; left: 50px; }
  .comp-hero-inner { max-width: 1200px; margin: 0 auto; padding: 0 32px; position: relative; }
  .comp-hero-badge { display: inline-flex; align-items: center; gap: 8px; font-family: ${F.m}; font-size: 0.72rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: ${A}; margin-bottom: 28px; }
  .comp-hero-badge::before { content: ''; width: 20px; height: 1.5px; background: ${A}; display: inline-block; }
  .comp-hero-h1 { font-family: ${F.h}; font-size: clamp(2.4rem, 4vw, 3.4rem); font-weight: 800; line-height: 1.08; letter-spacing: -0.035em; color: var(--text-primary); margin: 0 0 24px; max-width: 760px; }
  .comp-hero-accent { background: linear-gradient(135deg, #5548B0, ${A}, #9D94F0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .comp-hero-sub { font-family: ${F.b}; font-size: 1.1rem; line-height: 1.75; color: var(--text-secondary); max-width: 580px; margin: 0 0 40px; }
  .comp-hero-stats { display: flex; gap: 40px; flex-wrap: wrap; }
  .comp-hero-stat { font-family: ${F.h}; }
  .comp-hero-stat-val { font-size: 2rem; font-weight: 800; color: ${A}; letter-spacing: -0.04em; display: block; }
  .comp-hero-stat-label { font-family: ${F.b}; font-size: 0.8rem; color: var(--text-muted); }

  /* Section base */
  .comp-section { padding: 100px 0; }
  .comp-section-alt { background: var(--bg-2); }
  .comp-container { max-width: 1200px; margin: 0 auto; padding: 0 32px; }
  .comp-sec-label { display: flex; align-items: center; gap: 10px; font-family: ${F.m}; font-size: 0.72rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: ${A}; margin-bottom: 14px; }
  .comp-sec-label::before { content: ''; width: 20px; height: 1.5px; background: ${A}; display: inline-block; }
  .comp-section-title { font-family: ${F.h}; font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 700; line-height: 1.15; letter-spacing: -0.02em; color: var(--text-primary); margin: 0 0 16px; }
  .comp-section-sub { font-family: ${F.b}; font-size: 1rem; line-height: 1.7; color: var(--text-secondary); max-width: 600px; margin: 0 0 56px; }

  /* Pattern grid */
  .comp-pattern-tabs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 36px; }
  .comp-pattern-tab { font-family: ${F.m}; font-size: 0.72rem; font-weight: 500; letter-spacing: 0.06em; padding: 6px 14px; border-radius: 100px; border: 1px solid var(--border); cursor: pointer; transition: all 0.2s; background: transparent; color: var(--text-muted); }
  .comp-pattern-tab:hover, .comp-pattern-tab.active { border-color: ${A}; color: ${A}; background: rgba(123,111,232,0.08); }
  .comp-pattern-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; transition: all 0.4s cubic-bezier(0.16,1,0.3,1); }
  .comp-pattern-card:hover { box-shadow: var(--card-hover-shadow); border-color: var(--border-hover); }
  .comp-pattern-header { padding: 28px 28px 0; cursor: pointer; display: flex; align-items: flex-start; gap: 16px; }
  .comp-pattern-icon { width: 40px; height: 40px; border-radius: 10px; background: rgba(123,111,232,0.12); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .comp-pattern-icon-svg { width: 20px; height: 20px; stroke: ${A}; fill: none; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
  .comp-pattern-header-text { flex: 1; }
  .comp-pattern-name { font-family: ${F.h}; font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin: 0 0 6px; letter-spacing: -0.01em; }
  .comp-pattern-tagline { font-family: ${F.b}; font-size: 0.84rem; line-height: 1.55; color: var(--text-secondary); margin: 0; }
  .comp-pattern-toggle { font-family: ${F.m}; font-size: 0.72rem; color: ${A}; cursor: pointer; transition: transform 0.3s; margin-left: auto; flex-shrink: 0; margin-top: 4px; }
  .comp-pattern-toggle.open { transform: rotate(180deg); }
  .comp-pattern-body { padding: 0 28px 28px; margin-top: 20px; }
  .comp-pattern-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
  .comp-pattern-use { padding: 14px 16px; border-radius: 8px; }
  .comp-pattern-use.do { background: rgba(72,196,150,0.07); border: 1px solid rgba(72,196,150,0.15); }
  .comp-pattern-use.dont { background: rgba(232,123,111,0.07); border: 1px solid rgba(232,123,111,0.15); }
  .comp-pattern-use-label { font-family: ${F.m}; font-size: 0.66rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 6px; }
  .comp-pattern-use.do .comp-pattern-use-label { color: #48C496; }
  .comp-pattern-use.dont .comp-pattern-use-label { color: #E87B6F; }
  .comp-pattern-use-text { font-family: ${F.b}; font-size: 0.82rem; line-height: 1.6; color: var(--text-secondary); }
  .comp-code-block { background: var(--bg-2); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; }
  .comp-code-header { padding: 10px 14px; background: var(--bg-3, var(--bg)); border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 8px; }
  .comp-code-dot { width: 8px; height: 8px; border-radius: 50%; }
  .comp-code-lang { font-family: ${F.m}; font-size: 0.68rem; color: var(--text-muted); margin-left: 4px; }
  .comp-code-body { padding: 20px; overflow-x: auto; }
  .comp-code-pre { font-family: ${F.m}; font-size: 0.78rem; line-height: 1.85; color: var(--text-primary); margin: 0; white-space: pre; }
  .comp-code-kw { color: #9D94F0; }
  .comp-code-type { color: #48C4B2; }
  .comp-code-str { color: #E8B84D; }
  .comp-code-cmt { color: var(--text-muted); font-style: italic; }
  .comp-code-fn { color: ${A}; }

  /* Patterns list */
  .comp-patterns-list { display: flex; flex-direction: column; gap: 12px; }

  /* CTA */
  .comp-cta { background: var(--bg-2); padding: 100px 0; }
  .comp-cta-inner { max-width: 1200px; margin: 0 auto; padding: 0 32px; }
  .comp-cta-box { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-xl); padding: 64px; text-align: center; position: relative; overflow: hidden; }
  .comp-cta-glow { position: absolute; width: 600px; height: 300px; background: radial-gradient(ellipse, rgba(123,111,232,0.08) 0%, transparent 70%); top: 50%; left: 50%; transform: translate(-50%,-50%); pointer-events: none; }
  .comp-cta-title { font-family: ${F.h}; font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 700; color: var(--text-primary); margin: 0 0 16px; letter-spacing: -0.02em; position: relative; }
  .comp-cta-sub { font-family: ${F.b}; font-size: 1rem; line-height: 1.7; color: var(--text-secondary); margin: 0 0 36px; position: relative; }
  .comp-btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 14px 32px; border-radius: 100px; font-family: ${F.h}; font-size: 0.9rem; font-weight: 600; color: #fff; background: linear-gradient(135deg, #5548B0, ${A}); border: none; cursor: pointer; text-decoration: none; transition: all 0.2s; box-shadow: 0 4px 20px rgba(123,111,232,0.4); position: relative; }
  .comp-btn-primary:hover { transform: translateY(-2px) scale(1.03); box-shadow: 0 8px 32px rgba(123,111,232,0.55); }

  @media (max-width: 768px) {
    .comp-hero { padding: 120px 0 80px; }
    .comp-container { padding: 0 20px; }
    .comp-section { padding: 72px 0; }
    .comp-pattern-grid-2 { grid-template-columns: 1fr; }
    .comp-cta-box { padding: 40px 24px; }
  }
`;

// ─── Pattern data ──────────────────────────────────────────────────────────────
const PATTERNS = [
  {
    name: 'Tool-Use Wrapper',
    tagline: 'Standardised interface for agent tool calls with retry logic and structured error handling.',
    when: 'Any agent that calls external tools — APIs, databases, file systems, code execution. Anywhere a tool call might fail, time out, or return unexpected output.',
    whenNot: 'Simple one-shot prompts that do not make external calls. Adding a wrapper here is overhead without benefit.',
    icon: (
      <svg viewBox="0 0 24 24" className="comp-pattern-icon-svg">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    code: `// Tool-Use Wrapper — standardises all agent tool calls
interface ToolCall<TInput, TOutput> {
  name: string;
  input: TInput;
  execute: (input: TInput) => Promise<TOutput>;
  validate?: (output: TOutput) => boolean;
  maxRetries?: number; // default: 3
}

async function runTool<TInput, TOutput>(
  call: ToolCall<TInput, TOutput>
): Promise<ToolResult<TOutput>> {
  let attempt = 0;
  const max = call.maxRetries ?? 3;

  while (attempt < max) {
    try {
      const output = await call.execute(call.input);

      // Structural validation before returning
      if (call.validate && !call.validate(output)) {
        throw new ToolValidationError(call.name, output);
      }

      return { success: true, data: output, attempts: attempt + 1 };
    } catch (err) {
      attempt++;
      if (attempt >= max) {
        return { success: false, error: err, attempts: attempt };
      }
      // Exponential backoff: 200ms, 400ms, 800ms
      await sleep(200 * Math.pow(2, attempt - 1));
    }
  }
}`,
  },
  {
    name: 'Memory Manager',
    tagline: 'Working, episodic, and semantic memory abstraction that keeps agents context-aware without stuffing prompts.',
    when: 'Multi-turn conversations, long-running tasks, agents that need to recall past decisions, or any system where context exceeds one LLM call.',
    whenNot: 'Single-turn, stateless requests. The overhead of memory management is not worth it for a one-shot query.',
    icon: (
      <svg viewBox="0 0 24 24" className="comp-pattern-icon-svg">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
    code: `// Memory Manager — three-tier memory for agents
class MemoryManager {
  private working: Map<string, unknown>; // in-context, ephemeral
  private episodic: EpisodicStore;       // structured past interactions
  private semantic: VectorStore;         // embedded knowledge base

  // Add to working memory (cleared each task)
  setWorking(key: string, value: unknown) {
    this.working.set(key, value);
  }

  // Persist a meaningful interaction event
  async remember(event: MemoryEvent) {
    await this.episodic.insert({
      timestamp: Date.now(),
      type: event.type,
      summary: event.summary,
      metadata: event.metadata,
    });
  }

  // Retrieve semantically relevant context
  async recall(query: string, topK = 5): Promise<MemoryChunk[]> {
    const embedding = await embed(query);
    return this.semantic.query(embedding, topK);
  }

  // Build context block for next LLM call
  async buildContext(query: string): Promise<string> {
    const recent = await this.episodic.recent(5);
    const relevant = await this.recall(query, 3);
    return formatContext(recent, relevant, this.working);
  }
}`,
  },
  {
    name: 'Prompt Template Engine',
    tagline: 'Typed, versioned prompt templates with variable injection, version pinning, and A/B evaluation support.',
    when: "Systems with more than 3 prompts in production. Any time you need to track which prompt version produced which output, or iterate on prompts without breaking running systems.",
    whenNot: 'Prototypes and single-use scripts. Template overhead is not worth it until you have prompts running in production that you need to evolve safely.',
    icon: (
      <svg viewBox="0 0 24 24" className="comp-pattern-icon-svg">
        <polyline points="4 7 4 4 20 4 20 7" />
        <line x1="9" y1="20" x2="15" y2="20" />
        <line x1="12" y1="4" x2="12" y2="20" />
      </svg>
    ),
    code: `// Prompt Template Engine — typed, versioned prompts
interface PromptTemplate<T extends Record<string, string>> {
  id: string;
  version: string; // semver
  description: string;
  variables: (keyof T)[];
  template: string;
  model?: string;
  temperature?: number;
}

// Type-safe compilation with variable validation
function compilePrompt<T extends Record<string, string>>(
  template: PromptTemplate<T>,
  variables: T
): CompiledPrompt {
  // Validate all required variables are provided
  for (const key of template.variables) {
    if (!(key in variables)) {
      throw new MissingVariableError(String(key), template.id);
    }
  }

  const text = template.template.replace(
    /\{\{(\w+)\}\}/g,
    (_, key) => variables[key as keyof T] ?? ''
  );

  return {
    text,
    templateId: template.id,
    templateVersion: template.version,
    variables, // stored for debugging
  };
}`,
  },
  {
    name: 'Agent Coordinator',
    tagline: 'Orchestrates task distribution across multiple specialised agents with dependency resolution and result aggregation.',
    when: 'Complex tasks that benefit from parallelism or specialisation — code review + security scan + test generation running concurrently, or sequential pipelines where each stage has a different prompt and toolset.',
    whenNot: 'Simple sequential tasks that a single agent handles well. Coordination overhead adds latency and complexity.',
    icon: (
      <svg viewBox="0 0 24 24" className="comp-pattern-icon-svg">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
    code: `// Agent Coordinator — orchestrates multi-agent task graphs
interface AgentTask {
  id: string;
  agentType: AgentType;
  input: unknown;
  dependsOn?: string[]; // task IDs this task waits for
}

class AgentCoordinator {
  async run(tasks: AgentTask[]): Promise<TaskResults> {
    const results = new Map<string, TaskResult>();
    const pending = new Map(tasks.map(t => [t.id, t]));

    while (pending.size > 0) {
      // Find tasks whose dependencies are all resolved
      const ready = [...pending.values()].filter(task =>
        (task.dependsOn ?? []).every(dep => results.has(dep))
      );

      if (ready.length === 0) {
        throw new DeadlockError(Array.from(pending.keys()));
      }

      // Execute ready tasks in parallel
      const batch = await Promise.allSettled(
        ready.map(task => this.executeTask(task, results))
      );

      batch.forEach((result, i) => {
        const task = ready[i];
        results.set(task.id, result.status === 'fulfilled'
          ? { success: true, data: result.value }
          : { success: false, error: result.reason }
        );
        pending.delete(task.id);
      });
    }

    return results;
  }
}`,
  },
  {
    name: 'Output Validator',
    tagline: 'Structured output validation with automatic retry on schema violation and error injection into the retry prompt.',
    when: 'Any agent that must return structured data — JSON objects, typed responses, formatted outputs. Which is almost every production agent.',
    whenNot: 'Free-form text generation where the "output" is the prose itself. No point validating a blog post against a Zod schema.',
    icon: (
      <svg viewBox="0 0 24 24" className="comp-pattern-icon-svg">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    code: `// Output Validator — schema validation with retry loop
import { z } from 'zod';

async function validateWithRetry<T>(
  schema: z.ZodType<T>,
  generate: (hint?: string) => Promise<string>,
  maxAttempts = 3
): Promise<T> {
  let lastError: z.ZodError | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    // On retry, inject the validation error as a hint
    const hint = lastError
      ? \`Previous attempt failed validation: \${lastError.message}. Fix these issues.\`
      : undefined;

    const raw = await generate(hint);

    try {
      // Parse JSON then validate schema
      const parsed = JSON.parse(raw);
      return schema.parse(parsed);
    } catch (err) {
      if (err instanceof z.ZodError) {
        lastError = err;
        if (attempt < maxAttempts) continue;
      }
      // Non-Zod errors (JSON parse) escalate immediately
      throw new OutputValidationError(raw, err, attempt);
    }
  }

  // Exceeded retries — escalate to human review queue
  throw new HumanEscalationRequired(lastError!);
}`,
  },
  {
    name: 'Failure Recovery Handler',
    tagline: 'Exponential backoff, configurable fallback chains, and automatic human escalation when all recovery paths are exhausted.',
    when: 'Any production system. Failures in AI systems are not exceptional — they are expected. Plan for them from the start.',
    whenNot: "Nowhere. Every production AI system needs failure recovery. If you're skipping this, you're assuming nothing will fail.",
    icon: (
      <svg viewBox="0 0 24 24" className="comp-pattern-icon-svg">
        <polyline points="1 4 1 10 7 10" />
        <path d="M3.51 15a9 9 0 1 0 .49-3.75" />
      </svg>
    ),
    code: `// Failure Recovery Handler — fallbacks + escalation
interface RecoveryConfig {
  maxRetries: number;
  backoffMs: number; // base, doubles each retry
  fallbacks?: (() => Promise<unknown>)[];
  onEscalate?: (context: EscalationContext) => Promise<void>;
}

async function withRecovery<T>(
  fn: () => Promise<T>,
  config: RecoveryConfig
): Promise<T> {
  let lastError: Error;

  // Retry with exponential backoff
  for (let i = 0; i < config.maxRetries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err as Error;
      await sleep(config.backoffMs * Math.pow(2, i));
    }
  }

  // Try fallback chain
  for (const fallback of config.fallbacks ?? []) {
    try {
      return (await fallback()) as T;
    } catch { continue; }
  }

  // All recovery paths exhausted — escalate
  await config.onEscalate?.({
    error: lastError!,
    timestamp: Date.now(),
    retriesAttempted: config.maxRetries,
    fallbacksAttempted: config.fallbacks?.length ?? 0,
  });

  throw new UnrecoverableError(lastError!);
}`,
  },
  {
    name: 'Observability Middleware',
    tagline: 'Intercepts and logs every LLM request and response with full context: cost, latency, model version, and validation result.',
    when: "Every production system. Always. Without this you're flying blind. Add it before you write your first feature.",
    whenNot: 'Local development scripts you run once. Logging overhead for throwaway code is not worth it.',
    icon: (
      <svg viewBox="0 0 24 24" className="comp-pattern-icon-svg">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    code: `// Observability Middleware — wraps every LLM call
interface LLMEvent {
  requestId: string;
  agentId: string;
  taskType: string;
  model: string;
  temperature: number;
  promptTokens: number;
  completionTokens: number;
  costUsd: number;
  latencyMs: number;
  validationResult: 'pass' | 'fail' | 'retry';
  errorType?: string;
  timestamp: number;
}

function withObservability<T>(
  llmCall: (prompt: string) => Promise<T>,
  context: ObservabilityContext
): (prompt: string) => Promise<T> {
  return async (prompt: string) => {
    const start = Date.now();
    const requestId = generateId();
    let result: T;
    let error: Error | undefined;

    try {
      result = await llmCall(prompt);
      return result;
    } catch (err) {
      error = err as Error;
      throw err;
    } finally {
      // Always log — success or failure
      await logger.emit({
        requestId,
        agentId: context.agentId,
        taskType: context.taskType,
        latencyMs: Date.now() - start,
        error: error?.name,
        // ... token counts, cost from response headers
      });
    }
  };
}`,
  },
  {
    name: 'Cost Guard',
    tagline: 'Per-task token budget enforcement that prevents runaway agent loops from incurring unexpected API costs.',
    when: 'Any system with autonomous agents, especially those in a retry loop or with recursive task delegation. Essential for multi-agent systems where cost can compound.',
    whenNot: 'One-shot pipelines where you know the token count in advance and it never varies. Budget enforcement adds overhead with no benefit in predictable workloads.',
    icon: (
      <svg viewBox="0 0 24 24" className="comp-pattern-icon-svg">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    code: `// Cost Guard — per-task token budget enforcement
interface BudgetConfig {
  maxTokens: number;       // hard limit for the task
  warningThreshold: number; // fraction at which to warn (e.g., 0.8)
  onBudgetWarning?: (used: number, max: number) => void;
  onBudgetExceeded?: (used: number, max: number) => void;
}

class CostGuard {
  private usedTokens = 0;

  constructor(private config: BudgetConfig) {}

  // Call before each LLM invocation
  checkBudget(estimatedTokens: number): void {
    const projected = this.usedTokens + estimatedTokens;

    if (projected > this.config.maxTokens) {
      this.config.onBudgetExceeded?.(this.usedTokens, this.config.maxTokens);
      throw new BudgetExceededError(this.usedTokens, this.config.maxTokens);
    }

    const ratio = projected / this.config.maxTokens;
    if (ratio > this.config.warningThreshold) {
      this.config.onBudgetWarning?.(projected, this.config.maxTokens);
    }
  }

  // Call after each LLM response
  recordUsage(tokens: number): void {
    this.usedTokens += tokens;
  }

  get remaining(): number {
    return this.config.maxTokens - this.usedTokens;
  }
}`,
  },
];

// ─── Scroll reveal ─────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Pattern card ──────────────────────────────────────────────────────────────
function PatternCard({ pattern, index }: { pattern: typeof PATTERNS[0]; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <Reveal delay={index * 0.05}>
      <div className="comp-pattern-card">
        <div className="comp-pattern-header" onClick={() => setOpen(!open)}>
          <div className="comp-pattern-icon">{pattern.icon}</div>
          <div className="comp-pattern-header-text">
            <div className="comp-pattern-name">{pattern.name}</div>
            <p className="comp-pattern-tagline">{pattern.tagline}</p>
          </div>
          <span className={`comp-pattern-toggle${open ? ' open' : ''}`}>▼</span>
        </div>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <div className="comp-pattern-body">
                <div className="comp-pattern-grid-2">
                  <div className="comp-pattern-use do">
                    <div className="comp-pattern-use-label">Use when</div>
                    <div className="comp-pattern-use-text">{pattern.when}</div>
                  </div>
                  <div className="comp-pattern-use dont">
                    <div className="comp-pattern-use-label">Avoid when</div>
                    <div className="comp-pattern-use-text">{pattern.whenNot}</div>
                  </div>
                </div>
                <div className="comp-code-block">
                  <div className="comp-code-header">
                    <div className="comp-code-dot" style={{ background: '#E87B6F' }} />
                    <div className="comp-code-dot" style={{ background: '#E8B84D' }} />
                    <div className="comp-code-dot" style={{ background: '#48C496' }} />
                    <span className="comp-code-lang">TypeScript (pseudocode)</span>
                  </div>
                  <div className="comp-code-body">
                    <pre className="comp-code-pre">{pattern.code}</pre>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Reveal>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ComponentsPage() {
  return (
    <div className="comp-page">
      <style>{STYLES}</style>

      {/* ── Hero ── */}
      <section className="comp-hero">
        <div className="comp-hero-bg">
          <div className="comp-hero-orb comp-hero-orb-1" />
          <div className="comp-hero-orb comp-hero-orb-2" />
        </div>
        <div className="comp-hero-inner">
          <Reveal>
            <div className="comp-hero-badge">Labs · Component Patterns</div>
            <h1 className="comp-hero-h1">
              Reusable patterns from{' '}
              <span className="comp-hero-accent">2 years of production AI systems.</span>
            </h1>
            <p className="comp-hero-sub">
              These are not theoretical patterns. Each one emerged from a real production failure or a painful debugging session.
              We extracted them, documented them, and now use them as defaults in every new system we build.
            </p>
            <div className="comp-hero-stats">
              <div className="comp-hero-stat">
                <span className="comp-hero-stat-val">8</span>
                <span className="comp-hero-stat-label">Core patterns</span>
              </div>
              <div className="comp-hero-stat">
                <span className="comp-hero-stat-val">TypeScript</span>
                <span className="comp-hero-stat-label">All examples</span>
              </div>
              <div className="comp-hero-stat">
                <span className="comp-hero-stat-val">Production</span>
                <span className="comp-hero-stat-label">Battle-tested</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Patterns ── */}
      <section className="comp-section">
        <div className="comp-container">
          <Reveal>
            <div className="comp-sec-label">Pattern library</div>
            <h2 className="comp-section-title">Eight patterns we use in every system.</h2>
            <p className="comp-section-sub">
              Click any pattern to expand the full documentation: when to use it, when to avoid it,
              and a TypeScript pseudocode implementation.
            </p>
          </Reveal>
          <div className="comp-patterns-list">
            {PATTERNS.map((p, i) => (
              <PatternCard key={p.name} pattern={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="comp-cta">
        <div className="comp-cta-inner">
          <Reveal>
            <div className="comp-cta-box">
              <div className="comp-cta-glow" />
              <h2 className="comp-cta-title">Use these in your project.</h2>
              <p className="comp-cta-sub">
                When we build your system, these patterns are defaults — not optional add-ons.
                Every production AI pipeline we deliver includes observability, output validation,
                failure recovery, and human review gates from day one.
              </p>
              <Link href="/studio/start-project" className="comp-btn-primary">
                Start a project with Labs
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
