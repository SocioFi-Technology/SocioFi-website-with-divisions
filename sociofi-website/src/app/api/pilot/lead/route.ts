import { NextRequest, NextResponse } from 'next/server';

// ── Types ──────────────────────────────────────────────────────────────────────

interface LeadPayload {
  name: string;
  email: string;
  notes?: string;
  division: string;
  page_url: string;
  conversation_id: string;
  transcript: { role: string; content: string }[];
}

// ── Lead capture endpoint ──────────────────────────────────────────────────────
// Called when PILOT's in-chat lead form is submitted.
// Phase 1: Forwards to NEXUS if configured, otherwise stores locally / emails.
// Phase 2 (NEXUS): NEXUS handles CRM write, email notification, Slack alert.

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as LeadPayload;

    if (!payload.name?.trim() || !payload.email?.trim()) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
    }

    // Simple email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    // ── Route to NEXUS if configured ────────────────────────────────────────
    const NEXUS_URL = process.env.NEXUS_API_URL;
    const NEXUS_KEY = process.env.NEXUS_API_KEY;

    if (NEXUS_URL && NEXUS_KEY) {
      const nexusRes = await fetch(`${NEXUS_URL}/pilot/lead`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${NEXUS_KEY}`,
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000),
      });

      if (nexusRes.ok) {
        return NextResponse.json({ success: true });
      }
      console.error('[PILOT Lead] NEXUS error:', nexusRes.status);
      // Fall through to local handling
    }

    // ── Local fallback: log + send notification email ───────────────────────
    // In production, wire this to your email service (Resend, SendGrid, etc.)
    // or a database insert. For now, we log it server-side.
    console.log('[PILOT Lead] New lead captured:', {
      name: payload.name,
      email: payload.email,
      division: payload.division,
      page: payload.page_url,
      notes: payload.notes || '(none)',
      messageCount: payload.transcript?.length || 0,
      timestamp: new Date().toISOString(),
    });

    // If Formspree is configured, forward the lead
    const FORMSPREE_URL = process.env.FORMSPREE_ENDPOINT;
    if (FORMSPREE_URL) {
      await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: payload.name,
          email: payload.email,
          division: payload.division,
          page: payload.page_url,
          notes: payload.notes,
          source: 'PILOT Chat',
          conversation_length: payload.transcript?.length || 0,
        }),
      }).catch(err => console.error('[PILOT Lead] Formspree error:', err));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[PILOT Lead] Error:', error);
    return NextResponse.json({ error: 'Failed to capture lead.' }, { status: 500 });
  }
}
