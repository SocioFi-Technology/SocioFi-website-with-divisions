/**
 * Exponential backoff retry utility.
 * Used for Supabase calls, Claude API calls, and Resend calls.
 *
 * Usage:
 *   const result = await withRetry(() => supabase.from('...').select(), { maxAttempts: 3 })
 *   const result = await withRetry(() => anthropic.messages.create(...), { maxAttempts: 3, onFail: 'mark_failed' })
 */

export interface RetryOptions {
  /** Max number of attempts (default: 3) */
  maxAttempts?: number
  /** Base delay in ms — doubles each retry (default: 500) */
  baseDelay?: number
  /** Max delay cap in ms (default: 10_000) */
  maxDelay?: number
  /** Called on each failure with attempt number and error */
  onRetry?: (attempt: number, error: unknown) => void
  /** Predicate: return false to stop retrying immediately (e.g. 4xx errors) */
  shouldRetry?: (error: unknown) => boolean
}

export class RetryExhaustedError extends Error {
  constructor(
    public readonly attempts: number,
    public readonly lastError: unknown,
  ) {
    super(`Retry exhausted after ${attempts} attempts: ${String(lastError)}`)
    this.name = 'RetryExhaustedError'
  }
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function isRetryable(error: unknown): boolean {
  // Don't retry client errors (4xx) — they won't succeed on retry
  if (error && typeof error === 'object') {
    const status = (error as { status?: number }).status
    if (status && status >= 400 && status < 500) return false
    // Supabase error codes
    const code = (error as { code?: string }).code
    if (code === 'PGRST301') return false // JWT invalid
  }
  return true
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  opts: RetryOptions = {},
): Promise<T> {
  const {
    maxAttempts = 3,
    baseDelay = 500,
    maxDelay = 10_000,
    onRetry,
    shouldRetry = isRetryable,
  } = opts

  let lastError: unknown

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err

      if (attempt === maxAttempts || !shouldRetry(err)) {
        throw new RetryExhaustedError(attempt, err)
      }

      const wait = Math.min(baseDelay * 2 ** (attempt - 1), maxDelay)
      onRetry?.(attempt, err)
      await delay(wait)
    }
  }

  throw new RetryExhaustedError(maxAttempts, lastError)
}

/**
 * Convenience wrapper for Supabase queries with retry.
 * Throws the Supabase error if present.
 */
export async function supabaseWithRetry<T>(
  fn: () => Promise<{ data: T | null; error: unknown }>,
  opts?: RetryOptions,
): Promise<T> {
  return withRetry(async () => {
    const { data, error } = await fn()
    if (error) throw error
    return data as T
  }, opts)
}
