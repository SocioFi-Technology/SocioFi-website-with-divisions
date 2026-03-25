import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * POST /api/nexus/scribe
 * Triggers the SCRIBE agent to draft a blog post from a content calendar item.
 *
 * Body: { calendar_id: string } — the cms_content_calendar row to draft
 *
 * Flow:
 * 1. Load calendar item (title, brief, content_type, division)
 * 2. Mark calendar item status = 'drafting'
 * 3. POST to NEXUS /agents/scribe/run with the brief
 * 4. SCRIBE creates cms_posts row (status: review, author: SCRIBE, author_type: agent)
 * 5. Update cms_content_calendar.post_id = new post ID, status = 'review'
 * 6. Create approval_queue entry for admin review
 * 7. Return { post_id, approval_id }
 */
export async function POST(req: NextRequest) {
  // Auth check
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { calendar_id?: string; brief?: string; title?: string; division?: string; content_type?: string }
  try {
    body = await req.json() as typeof body
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const nexusUrl = process.env.NEXUS_API_URL ?? 'http://localhost:8001'
  const nexusKey = process.env.NEXUS_API_KEY ?? ''

  try {
    // ── If triggered from content calendar, load the item ──────────────────
    let calendarItem: Record<string, unknown> | null = null
    if (body.calendar_id) {
      const { data, error } = await supabase
        .from('cms_content_calendar')
        .select('*')
        .eq('id', body.calendar_id)
        .single()
      if (error || !data) {
        return NextResponse.json({ error: 'Calendar item not found' }, { status: 404 })
      }
      calendarItem = data as Record<string, unknown>

      // Mark as drafting
      await supabase
        .from('cms_content_calendar')
        .update({ status: 'drafting', updated_at: new Date().toISOString() })
        .eq('id', body.calendar_id)
    }

    // ── Build the brief for SCRIBE ──────────────────────────────────────────
    const brief = {
      title: (calendarItem?.title as string) ?? body.title ?? 'Untitled',
      topic: (calendarItem?.brief as string) ?? body.brief ?? '',
      content_type: (calendarItem?.content_type as string) ?? body.content_type ?? 'blog_post',
      division: (calendarItem?.division as string) ?? body.division ?? null,
      calendar_id: body.calendar_id ?? null,
    }

    // ── Call NEXUS SCRIBE agent ─────────────────────────────────────────────
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 120_000) // 2 min timeout

    let nexusResponse: Record<string, unknown> = {}
    try {
      const nexusRes = await fetch(`${nexusUrl}/agents/scribe/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': nexusKey,
        },
        body: JSON.stringify({ task: 'draft_content', brief }),
        signal: controller.signal,
      })
      clearTimeout(timeout)

      if (!nexusRes.ok) {
        throw new Error(`NEXUS returned ${nexusRes.status}`)
      }
      nexusResponse = await nexusRes.json() as Record<string, unknown>
    } catch (nexusErr) {
      clearTimeout(timeout)
      // NEXUS unavailable — create a placeholder draft for manual writing
      nexusResponse = {
        post_id: null,
        error: nexusErr instanceof Error ? nexusErr.message : 'NEXUS unavailable',
      }
    }

    // ── If NEXUS didn't create the post, create a placeholder draft ────────
    let postId = nexusResponse.post_id as string | null

    if (!postId) {
      const slug = brief.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') +
        '-' + Date.now().toString(36)

      const { data: newPost, error: postErr } = await supabase
        .from('cms_posts')
        .insert({
          type: brief.content_type,
          status: 'review',
          title: brief.title,
          slug,
          division: brief.division,
          author: 'SCRIBE',
          author_type: 'agent',
          content_json: { type: 'doc', content: [] },
        })
        .select('id')
        .single()

      if (postErr) {
        return NextResponse.json({ error: 'Failed to create draft post' }, { status: 500 })
      }
      postId = (newPost as { id: string }).id
    }

    // ── Update calendar item with post link ─────────────────────────────────
    if (body.calendar_id && postId) {
      await supabase
        .from('cms_content_calendar')
        .update({ post_id: postId, status: 'review', updated_at: new Date().toISOString() })
        .eq('id', body.calendar_id)
    }

    // ── Create approval_queue entry ─────────────────────────────────────────
    let approvalId: string | null = null
    const { data: approval } = await supabase
      .from('approval_queue')
      .insert({
        agent_name: 'SCRIBE',
        action_type: 'content_draft',
        subject: `Blog draft: "${brief.title}"`,
        payload: { post_id: postId, calendar_id: body.calendar_id ?? null },
        urgency: 'low',
        confidence: 80,
        status: 'pending',
      })
      .select('id')
      .single()

    if (approval) approvalId = (approval as { id: string }).id

    return NextResponse.json({ post_id: postId, approval_id: approvalId, status: 'queued' })

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
