import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { processSubmission } from '@/lib/admin/processSubmission';

const TicketSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  plan: z.string().min(1),
  type: z.enum(['incident', 'bug', 'question', 'feature']),
  priority_self_reported: z.enum(['p1', 'p2', 'p3', 'p4']),
  title: z.string().min(1),
  description: z.string().min(1),
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
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const parsed = TicketSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.issues },
        { status: 400 },
      );
    }

    const result = await processSubmission({
      division: 'services',
      type: `ticket-${parsed.data.type}`,
      data: parsed.data,
      source_url: parsed.data.source_url,
      utm: parsed.data.utm,
    });

    return NextResponse.json({ success: true, ...result }, { status: 201 });
  } catch (err) {
    console.error('[API ERROR] /api/services/ticket', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
