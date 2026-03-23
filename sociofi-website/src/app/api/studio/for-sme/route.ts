import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { processSubmission } from '@/lib/admin/processSubmission';

const ForSMESchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  company: z.string().min(1),
  industry: z.string().optional(),
  employee_count: z.string().optional(),
  project_type: z
    .enum(['internal_tool', 'customer_app', 'automation', 'integration', 'other'])
    .optional(),
  description: z.string().min(20),
  budget_range: z.string().optional(),
  has_existing_system: z.boolean().optional(),
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

    const parsed = ForSMESchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.issues },
        { status: 400 },
      );
    }

    const result = await processSubmission({
      division: 'studio',
      type: 'audience-sme',
      data: parsed.data,
      source_url: parsed.data.source_url,
      utm: parsed.data.utm,
    });

    return NextResponse.json({ success: true, ...result }, { status: 201 });
  } catch (err) {
    console.error('[API ERROR] /api/studio/for-sme', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
