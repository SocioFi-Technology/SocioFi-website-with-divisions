import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { processSubmission } from '@/lib/admin/processSubmission';

const CloudMigrationSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional(),
  current_provider: z.enum(['aws', 'gcp', 'azure', 'heroku', 'vercel', 'railway', 'other']),
  reason_for_migration: z.string().min(20),
  app_type: z.string().min(1),
  monthly_spend: z.string().optional(),
  migration_timeline: z.string().optional(),
  has_downtime_tolerance: z.boolean().optional(),
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

    const parsed = CloudMigrationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.issues },
        { status: 400 },
      );
    }

    const result = await processSubmission({
      division: 'cloud',
      type: 'cloud-migration',
      data: parsed.data,
      source_url: parsed.data.source_url,
      utm: parsed.data.utm,
    });

    return NextResponse.json({ success: true, ...result }, { status: 201 });
  } catch (err) {
    console.error('[API ERROR] /api/cloud/migration', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
