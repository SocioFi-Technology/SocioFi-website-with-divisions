import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { processSubmission } from '@/lib/admin/processSubmission';

const AgentsDeploySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional(),
  agent_id: z.string().optional(),
  environment: z.string().optional(),
  integrations: z.array(z.string()).optional(),
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

    const parsed = AgentsDeploySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.issues },
        { status: 400 },
      );
    }

    const result = await processSubmission({
      division: 'agents',
      type: 'agent-deploy',
      data: parsed.data,
      source_url: parsed.data.source_url,
      utm: parsed.data.utm,
    });

    return NextResponse.json({ success: true, ...result }, { status: 201 });
  } catch (err) {
    console.error('[API ERROR] /api/agents/deploy', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
