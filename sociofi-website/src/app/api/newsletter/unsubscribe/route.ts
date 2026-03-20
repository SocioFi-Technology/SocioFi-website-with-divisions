import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const UnsubscribeSchema = z.object({
  email: z.string().email(),
  token: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const parsed = UnsubscribeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.issues },
        { status: 400 },
      );
    }

    const { email } = parsed.data;

    const supabase = await createClient();

    const { error } = await supabase
      .from('subscribers')
      .update({ unsubscribed: true, unsub_at: new Date().toISOString() })
      .eq('email', email);

    if (error) {
      console.error('[API ERROR] /api/newsletter/unsubscribe Supabase error:', error);
      return NextResponse.json({ error: 'Failed to unsubscribe' }, { status: 500 });
    }

    console.log('[NOTIFY] newsletter unsubscribe', email);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('[API ERROR] /api/newsletter/unsubscribe', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
