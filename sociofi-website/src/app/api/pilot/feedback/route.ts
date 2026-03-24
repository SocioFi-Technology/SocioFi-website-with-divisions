import { NextRequest, NextResponse } from 'next/server';

// ── PILOT message feedback endpoint ─────────────────────────────────────────
// Records thumbs up/down on PILOT responses for quality tracking.
// Phase 1: Server-side log. Phase 2: Forward to NEXUS for analytics DB.

export async function POST(req: NextRequest) {
  try {
    const { message_id, conversation_id, rating, division } = (await req.json()) as {
      message_id: string;
      conversation_id: string;
      rating: 'up' | 'down';
      division?: string;
    };

    if (!message_id || !rating || !['up', 'down'].includes(rating)) {
      return NextResponse.json({ error: 'Invalid feedback.' }, { status: 400 });
    }

    // Route to NEXUS if configured
    const NEXUS_URL = process.env.NEXUS_API_URL;
    const NEXUS_KEY = process.env.NEXUS_API_KEY;

    if (NEXUS_URL && NEXUS_KEY) {
      fetch(`${NEXUS_URL}/pilot/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${NEXUS_KEY}`,
        },
        body: JSON.stringify({ message_id, conversation_id, rating, division }),
      }).catch(err => console.error('[PILOT Feedback] NEXUS error:', err));
    }

    // Log locally regardless
    console.log('[PILOT Feedback]', {
      message_id,
      conversation_id,
      rating,
      division,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[PILOT Feedback] Error:', error);
    return NextResponse.json({ error: 'Failed to record feedback.' }, { status: 500 });
  }
}
