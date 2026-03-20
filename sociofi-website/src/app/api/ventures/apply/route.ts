import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { processSubmission } from '@/lib/admin/processSubmission';

const VenturesApplySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  startup_name: z.string().min(1),
  stage: z.string().min(1),
  sector: z.string().optional(),
  description: z.string().min(1),
  monthly_revenue: z.string().optional(),
  team_size: z.string().optional(),
  funding: z.string().optional(),
  ask: z.string().optional(),
  pitch_deck_url: z.string().url().optional(),
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

    const parsed = VenturesApplySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.issues },
        { status: 400 },
      );
    }

    const result = await processSubmission({
      division: 'ventures',
      type: 'ventures-application',
      data: parsed.data,
      source_url: parsed.data.source_url,
      utm: parsed.data.utm,
    });

    return NextResponse.json({ success: true, ...result }, { status: 201 });
  } catch (err) {
    console.error('[API ERROR] /api/ventures/apply', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
