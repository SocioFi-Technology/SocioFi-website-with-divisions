import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { processSubmission } from '@/lib/admin/processSubmission';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

const ContactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(1),
  source_url: z.string().optional(),
  utm: z
    .object({
      source: z.string().optional(),
      medium: z.string().optional(),
      campaign: z.string().optional(),
    })
    .optional(),
});

export async function POST(req: NextRequest) {
  try {
    // Rate limiting: 5 submissions per IP per hour
    const ip = getClientIp(req)
    const rl = checkRateLimit(`contact:${ip}`, 5, 60 * 60 * 1000)
    if (!rl.success) {
      return NextResponse.json(
        { error: 'Too many submissions. Please wait before trying again.' },
        { status: 429 }
      )
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    // Honeypot: bots fill hidden fields, humans don't
    const { hp_field, ...bodyWithoutHoneypot } = body as Record<string, unknown>
    if (hp_field) {
      // Silently succeed — don't tell bots they were caught
      return NextResponse.json({ ok: true })
    }

    const parsed = ContactSchema.safeParse(bodyWithoutHoneypot);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.issues },
        { status: 400 },
      );
    }

    const result = await processSubmission({
      division: 'parent',
      type: 'contact',
      data: parsed.data,
      source_url: parsed.data.source_url,
      utm: parsed.data.utm,
    });

    return NextResponse.json({ success: true, ...result }, { status: 201 });
  } catch (err) {
    console.error('[API ERROR] /api/contact', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
