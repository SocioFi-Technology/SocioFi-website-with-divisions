'use client'
/**
 * Centralised Supabase query functions for the admin panel.
 * All functions return typed data mapped from DB columns to admin UI types.
 */
import { createClient } from '@/lib/supabase/client'
import type { Contact, Submission, LifecycleStage, ContentItem, MediaItem } from './types'

// ── Contacts ──────────────────────────────────────────────────────────────────

export async function fetchContacts(opts?: {
  stage?: string
  search?: string
  limit?: number
}) {
  const supabase = createClient()
  let q = supabase
    .from('contacts')
    .select(
      'id,email,name,company,phone,source,lifecycle_stage,tags,lead_score,assigned_to,updated_at,created_at,division_interest'
    )
    .order('updated_at', { ascending: false })
    .limit(opts?.limit ?? 200)

  if (opts?.stage && opts.stage !== 'all') {
    q = q.eq('lifecycle_stage', opts.stage)
  }
  if (opts?.search) {
    const s = opts.search.replace(/'/g, "''")
    q = q.or(`name.ilike.%${s}%,email.ilike.%${s}%,company.ilike.%${s}%`)
  }

  const { data, error } = await q
  if (error) throw error

  return (data ?? []).map(
    (row): Contact => ({
      id: row.id as string,
      name: ((row.name ?? row.email) as string) || 'Unknown',
      email: row.email as string,
      company: row.company as string | undefined,
      phone: row.phone as string | undefined,
      source: (row.source ?? 'direct') as string,
      stage: (row.lifecycle_stage ?? 'lead') as LifecycleStage,
      tags: (row.tags ?? []) as string[],
      score: (row.lead_score ?? 0) as number,
      assigned_to: row.assigned_to as string | undefined,
      last_activity_at: row.updated_at as string,
      created_at: row.created_at as string,
      division_interests: (row.division_interest ?? []) as Contact['division_interests'],
    })
  )
}

// ── Submissions ───────────────────────────────────────────────────────────────

export async function fetchSubmissions(opts?: {
  division?: string
  status?: string
  priority?: string
  type?: string
  search?: string
  limit?: number
}) {
  const supabase = createClient()
  let q = supabase
    .from('submissions')
    .select(
      'id,type,division,status,priority,data,ai_score,ai_classification,contact_id,assigned_to,created_at,updated_at,contacts(name,email,company)'
    )
    .order('created_at', { ascending: false })
    .limit(opts?.limit ?? 100)

  if (opts?.division && opts.division !== 'all') q = q.eq('division', opts.division)
  if (opts?.status && opts.status !== 'all') q = q.eq('status', opts.status)
  if (opts?.priority && opts.priority !== 'all') q = q.eq('priority', opts.priority)
  if (opts?.type && opts.type !== 'all') q = q.eq('type', opts.type)

  const { data, error } = await q
  if (error) throw error

  return (data ?? [])
    .filter(row => {
      if (!opts?.search) return true
      const sq = opts.search.toLowerCase()
      const contact = row.contacts as { name?: string; email?: string } | null
      const fields = (row.data ?? {}) as Record<string, unknown>
      return (
        contact?.name?.toLowerCase().includes(sq) ||
        contact?.email?.toLowerCase().includes(sq) ||
        (fields.description as string | undefined)?.toLowerCase().includes(sq) ||
        (fields.message as string | undefined)?.toLowerCase().includes(sq) ||
        (fields.name as string | undefined)?.toLowerCase().includes(sq)
      )
    })
    .map((row): Submission => {
      const fields = (row.data ?? {}) as Record<string, unknown>
      const contact = row.contacts as { name?: string; email?: string } | null
      const aiClass = (row.ai_classification ?? {}) as Record<string, unknown>
      const name = contact?.name ?? (fields.name as string) ?? 'Unknown'
      const email = contact?.email ?? (fields.email as string) ?? ''
      // Best-effort summary from common JSONB field names
      const summary = (
        (fields.description as string) ??
        (fields.message as string) ??
        (fields.details as string) ??
        (fields.project_description as string) ??
        (fields.startup_description as string) ??
        (Object.values(fields).find(v => typeof v === 'string' && (v as string).length > 20) as string) ??
        ''
      ).slice(0, 200)

      return {
        id: row.id as string,
        status: row.status as Submission['status'],
        priority: (row.priority ?? 'normal') as Submission['priority'],
        division: row.division as Submission['division'],
        type: row.type as string,
        contact_name: name,
        contact_email: email,
        contact_id: row.contact_id as string | undefined,
        summary,
        assigned_to: row.assigned_to as string | undefined,
        ai_score: row.ai_score as number | undefined,
        created_at: row.created_at as string,
        updated_at: (row.updated_at ?? row.created_at) as string,
        fields: fields as Record<string, string | number | boolean | null>,
        notes: [],
        tags: (aiClass.tags ?? []) as string[],
      }
    })
}

// ── Ventures Applications ─────────────────────────────────────────────────────

export async function fetchVenturesApplications(opts?: { status?: string }) {
  const supabase = createClient()
  let q = supabase
    .from('ventures_applications')
    .select(
      'id,submission_id,contact_id,scores,weighted_average,preferred_model,proposed_terms,decision,decision_reason,decision_by,decision_at,created_at,contacts(name,email),submissions(data,created_at)'
    )
    .order('created_at', { ascending: false })
    .limit(100)

  if (opts?.status && opts.status !== 'all') {
    q = q.eq('decision', opts.status)
  }

  const { data, error } = await q
  if (error) throw error

  return (data ?? []).map(row => {
    const contact = (row.contacts ?? {}) as { name?: string; email?: string }
    const sub = (row.submissions ?? {}) as { data?: Record<string, unknown>; created_at?: string }
    const fields = (sub.data ?? {}) as Record<string, unknown>
    const submittedAt = (sub.created_at ?? row.created_at) as string
    const decisionDue = new Date(new Date(submittedAt).getTime() + 7 * 86_400_000).toISOString()
    const scores = (row.scores ?? {}) as Record<string, number>

    return {
      id: row.id as string,
      status: ((row.decision ?? 'pending') as string) as 'pending' | 'interview' | 'accepted' | 'rejected' | 'waitlisted',
      submitted_at: submittedAt,
      decision_due: decisionDue,
      founder_name:
        contact.name ?? (fields.founder_name as string) ?? (fields.name as string) ?? 'Unknown',
      founder_email:
        contact.email ?? (fields.founder_email as string) ?? (fields.email as string) ?? '',
      founder_bio: (fields.founder_bio as string) ?? '',
      founder_linkedin: (fields.founder_linkedin as string) ?? '',
      founder_commitment: (fields.founder_commitment as string) ?? 'unknown',
      product_name:
        (fields.product_name as string) ?? (fields.startup_name as string) ?? '',
      product_description:
        (fields.product_description as string) ?? (fields.description as string) ?? '',
      problem_statement: (fields.problem_statement as string) ?? '',
      target_customer: (fields.target_customer as string) ?? '',
      revenue_model: (fields.revenue_model as string) ?? '',
      validation_status:
        ((fields.validation_status as string) ?? 'none') as
          | 'paying'
          | 'waitlist'
          | 'conversations'
          | 'none',
      validation_details: (fields.validation_details as string) ?? '',
      prior_attempts: (fields.prior_attempts as string) ?? '',
      preferred_model:
        ((row.preferred_model ?? fields.preferred_model ?? 'equity') as string) as
          | 'equity'
          | 'revenue_share'
          | 'hybrid',
      growth_plan: (fields.growth_plan as string) ?? '',
      additional_context: fields.additional_context as string | undefined,
      attachments: [],
      scores,
      score_notes: {},
      weighted_score: row.weighted_average as number | undefined,
      decision: row.decision as string | undefined,
      decision_reason: row.decision_reason as string | undefined,
      decision_at: row.decision_at as string | undefined,
      decision_by: row.decision_by as string | undefined,
    }
  })
}

// ── Pipeline Snapshot ─────────────────────────────────────────────────────────

export async function fetchPipelineSnapshot() {
  const supabase = createClient()
  const { data } = await supabase
    .from('pipeline_entries')
    .select('pipeline,stage')
    .is('exited_at', null) // active entries only

  const grouped: Record<string, Record<string, number>> = {}
  for (const row of data ?? []) {
    const p = (row.pipeline as string).toLowerCase()
    const s = row.stage as string
    if (!grouped[p]) grouped[p] = {}
    grouped[p][s] = (grouped[p][s] ?? 0) + 1
  }
  return grouped
}

// ── Agent Last Runs ───────────────────────────────────────────────────────────

export async function fetchAgentLastRuns(): Promise<
  Record<string, { lastRun: string; tasks: number; hasError: boolean }>
> {
  const supabase = createClient()
  const since = new Date(Date.now() - 24 * 3_600_000).toISOString()
  const { data } = await supabase
    .from('nexus_agent_runs')
    .select('agent,status,created_at')
    .gte('created_at', since)
    .order('created_at', { ascending: false })

  const byAgent: Record<string, { lastRun: string; tasks: number; hasError: boolean }> = {}
  for (const run of data ?? []) {
    const name = run.agent as string
    if (!byAgent[name]) byAgent[name] = { lastRun: run.created_at, tasks: 0, hasError: false }
    byAgent[name].tasks++
    if (run.status === 'failed') byAgent[name].hasError = true
  }
  return byAgent
}

// ── Attention Items ───────────────────────────────────────────────────────────

function _relativeTime(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export async function fetchAttentionItems() {
  const supabase = createClient()
  const oneDayAgo = new Date(Date.now() - 24 * 3_600_000).toISOString()
  const twoHoursFromNow = new Date(Date.now() + 2 * 3_600_000).toISOString()
  const fiveDaysAgo = new Date(Date.now() - 5 * 86_400_000).toISOString()

  const [
    { data: urgentTickets },
    { data: staleSubmissions },
    { data: venturesDue },
    { data: slaTickets },
  ] = await Promise.all([
    supabase
      .from('tickets')
      .select('id,title,priority,created_at')
      .in('priority', ['p1', 'p2'])
      .eq('status', 'open')
      .limit(3),
    supabase
      .from('submissions')
      .select('id,created_at,contacts(name)')
      .eq('status', 'new')
      .lt('created_at', oneDayAgo)
      .limit(3),
    supabase
      .from('ventures_applications')
      .select('id,created_at,contacts(name)')
      .eq('decision', 'pending')
      .lt('created_at', fiveDaysAgo)
      .limit(3),
    supabase
      .from('tickets')
      .select('id,title,sla_response_deadline')
      .lt('sla_response_deadline', twoHoursFromNow)
      .gt('sla_response_deadline', new Date().toISOString())
      .not('status', 'in', '("resolved","closed")')
      .limit(3),
  ])

  const items: {
    id: string
    type: 'ticket' | 'submission' | 'followup' | 'ventures' | 'sla'
    priority: 'red' | 'amber'
    description: string
    time: string
    href: string
  }[] = []

  for (const t of urgentTickets ?? []) {
    items.push({
      id: `ticket-${t.id}`,
      type: 'ticket',
      priority: 'red',
      description: `${(t.priority as string).toUpperCase()} ticket — ${t.title}`,
      time: _relativeTime(t.created_at),
      href: '/admin/tickets',
    })
  }
  for (const s of staleSubmissions ?? []) {
    const contact = s.contacts as { name?: string } | null
    items.push({
      id: `sub-${s.id}`,
      type: 'submission',
      priority: 'amber',
      description: `Submission from ${contact?.name ?? 'Unknown'} pending review`,
      time: _relativeTime(s.created_at),
      href: '/admin/submissions',
    })
  }
  for (const v of venturesDue ?? []) {
    const contact = v.contacts as { name?: string } | null
    items.push({
      id: `ventures-${v.id}`,
      type: 'ventures',
      priority: 'amber',
      description: `Ventures application from ${contact?.name ?? 'Unknown'} — response needed`,
      time: 'Deadline approaching',
      href: '/admin/ventures/applications',
    })
  }
  for (const t of slaTickets ?? []) {
    items.push({
      id: `sla-${t.id}`,
      type: 'sla',
      priority: 'red',
      description: `SLA deadline approaching — ${t.title}`,
      time: `Due ${_relativeTime(t.sla_response_deadline)}`,
      href: '/admin/tickets',
    })
  }

  return items.slice(0, 5)
}

// ── CMS Content ────────────────────────────────────────────────────────────────

export async function fetchContentItems(opts?: {
  type?: string
  status?: string
  division?: string
  search?: string
  limit?: number
}): Promise<ContentItem[]> {
  const supabase = createClient()
  let q = supabase
    .from('cms_posts')
    .select('id,type,status,title,slug,division,author,author_type,edited_by,tags,seo_title,seo_description,cover_image,word_count,featured,published_at,created_at,updated_at,content_json')
    .order('updated_at', { ascending: false })
    .limit(opts?.limit ?? 100)

  if (opts?.type && opts.type !== 'all') q = q.eq('type', opts.type)
  if (opts?.status && opts.status !== 'all') q = q.eq('status', opts.status)
  if (opts?.division && opts.division !== 'all') q = q.eq('division', opts.division)
  if (opts?.search) {
    const s = opts.search.replace(/'/g, "''")
    q = q.or(`title.ilike.%${s}%,author.ilike.%${s}%`)
  }

  const { data, error } = await q
  if (error) throw error

  return (data ?? []).map((row): ContentItem => ({
    id: row.id as string,
    type: row.type as ContentItem['type'],
    status: row.status as ContentItem['status'],
    title: row.title as string,
    slug: row.slug as string,
    division: row.division as string | undefined,
    author: row.author as string,
    author_type: (row.author_type ?? 'human') as 'human' | 'agent',
    edited_by: row.edited_by as string | undefined,
    tags: (row.tags ?? []) as string[],
    seo_title: row.seo_title as string | undefined,
    seo_description: row.seo_description as string | undefined,
    featured_image: row.cover_image as string | undefined,
    word_count: row.word_count as number | undefined,
    published_at: row.published_at as string | undefined,
    updated_at: row.updated_at as string,
    content_json: row.content_json as Record<string, unknown> | undefined,
    metadata: {},
  }))
}

export async function fetchMediaItems(opts?: {
  folder?: string
  limit?: number
}): Promise<MediaItem[]> {
  const supabase = createClient()
  let q = supabase
    .from('cms_media')
    .select('id,filename,original_name,public_url,mime_type,size_bytes,media_type,folder,alt_text,width,height,uploaded_by,created_at')
    .order('created_at', { ascending: false })
    .limit(opts?.limit ?? 200)

  if (opts?.folder && opts.folder !== 'all') q = q.eq('folder', opts.folder)

  const { data, error } = await q
  if (error) throw error

  return (data ?? []).map((row): MediaItem => ({
    id: row.id as string,
    filename: row.filename as string,
    original_name: row.original_name as string,
    public_url: row.public_url as string,
    mime_type: row.mime_type as string,
    size_bytes: row.size_bytes as number,
    media_type: (row.media_type ?? 'image') as MediaItem['media_type'],
    folder: (row.folder ?? 'general') as MediaItem['folder'],
    alt_text: row.alt_text as string | undefined,
    width: row.width as number | undefined,
    height: row.height as number | undefined,
    uploaded_by: row.uploaded_by as string,
    created_at: row.created_at as string,
  }))
}

// ── Content Calendar ───────────────────────────────────────────────────────────

export async function fetchCalendarItems(opts?: { status?: string; limit?: number }) {
  const supabase = createClient()
  let q = supabase
    .from('cms_content_calendar')
    .select('id,title,brief,content_type,division,due_date,status,assigned_to,post_id,created_by,created_at')
    .order('due_date', { ascending: true })
    .limit(opts?.limit ?? 50)

  if (opts?.status && opts.status !== 'all') q = q.eq('status', opts.status)

  const { data, error } = await q
  if (error) throw error
  return data ?? []
}
