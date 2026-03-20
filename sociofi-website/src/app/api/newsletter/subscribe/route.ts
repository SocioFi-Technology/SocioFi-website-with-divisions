import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const SubscribeSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  source: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const parsed = SubscribeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.issues },
        { status: 400 },
      );
    }

    const { email, name, source } = parsed.data;

    const supabase = await createClient();

    const { data: existing } = await supabase
      .from('subscribers')
      .select('id, unsubscribed')
      .eq('email', email)
      .single();

    if (existing) {
      if (existing.unsubscribed) {
        // Re-subscribe
        await supabase
          .from('subscribers')
          .update({ unsubscribed: false, unsub_at: null })
          .eq('id', existing.id);
      }
      return NextResponse.json(
        { success: true, message: 'Already subscribed', subscriber_id: existing.id },
        { status: 200 },
      );
    }

    const insertData: Record<string, unknown> = {
      email,
      confirmed: false,
      unsubscribed: false,
      lists: ['general'],
    };
    if (name) insertData.name = name;
    if (source) insertData.source = source;

    const { data: subscriber, error } = await supabase
      .from('subscribers')
      .insert(insertData)
      .select('id')
      .single();

    if (error) {
      console.error('[API ERROR] /api/newsletter/subscribe Supabase error:', error);
      return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
    }

    console.log('[NOTIFY] newsletter subscribe', email);

    return NextResponse.json(
      { success: true, subscriber_id: subscriber?.id },
      { status: 201 },
    );
  } catch (err) {
    console.error('[API ERROR] /api/newsletter/subscribe', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
