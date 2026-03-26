import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * POST /api/tickets/submit
 * Public endpoint — no auth required. Used by the "Submit a Ticket" form on services pages.
 *
 * Body:
 *   name        string  (required)
 *   email       string  (required)
 *   title       string  (required) — short summary of the issue
 *   description string  (optional)
 *   type        string  (optional) 'bug' | 'feature' | 'incident' | 'question'  default: 'bug'
 *   plan        string  (optional) — current service plan if known
 *
 * Flow:
 * 1. Find or create a contact by email
 * 2. Insert a ticket row (status: open, priority: p3 default)
 * 3. POST to NEXUS /webhook/ticket so WARDEN can triage it
 * 4. Return { ticket_id }
 */
export async function POST(req: NextRequest) {
  let body: {
    name?: string
    email?: string
    title?: string
    description?: string
    type?: string
    plan?: string
  }
  try {
    body = await req.json() as typeof body
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { name, email, title, description, type = 'bug', plan } = body

  if (!name || !email || !title) {
    return NextResponse.json({ error: 'name, email, and title are required' }, { status: 422 })
  }

  // Use service role key — we need to bypass RLS for the upsert
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // 1. Find or create contact
  let contactId: string
  const { data: existingContact } = await supabase
    .from('contacts')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  if (existingContact) {
    contactId = existingContact.id as string
  } else {
    const { data: newContact, error: contactErr } = await supabase
      .from('contacts')
      .insert({ name, email, lifecycle_stage: 'customer' })
      .select('id')
      .single()

    if (contactErr || !newContact) {
      return NextResponse.json({ error: 'Failed to create contact' }, { status: 500 })
    }
    contactId = (newContact as { id: string }).id
  }

  // 2. Create the ticket
  const ticketPayload: Record<string, unknown> = {
    contact_id: contactId,
    type,
    title,
    description: description ?? null,
    status: 'open',
    priority: 'p3',
  }
  if (plan) ticketPayload.plan = plan

  const { data: ticket, error: ticketErr } = await supabase
    .from('tickets')
    .insert(ticketPayload)
    .select('id')
    .single()

  if (ticketErr || !ticket) {
    return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 })
  }
  const ticketId = (ticket as { id: string }).id

  // 3. Notify NEXUS so WARDEN can triage in the background
  const nexusUrl = process.env.NEXUS_API_URL ?? 'http://localhost:8001'
  const nexusKey = process.env.NEXUS_API_KEY ?? ''

  try {
    await fetch(`${nexusUrl}/webhook/ticket`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${nexusKey}`,
      },
      body: JSON.stringify({
        ticket_id: ticketId,
        contact_id: contactId,
        ticket_data: { title, description, type, plan },
      }),
      signal: AbortSignal.timeout(10_000),
    })
  } catch {
    // NEXUS unavailable — ticket is still saved, WARDEN will pick it up on next scheduled run
  }

  return NextResponse.json({ ticket_id: ticketId, status: 'received' }, { status: 201 })
}
