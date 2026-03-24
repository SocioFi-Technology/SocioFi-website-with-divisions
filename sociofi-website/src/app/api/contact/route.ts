import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { processSubmission } from '@/lib/admin/processSubmission';

// Handles both ContactForm { name, email, division, message, source }
// and ProjectForm { name, email, company, budget, timeline, description, type }
const ContactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  // ContactForm fields
  division: z.string().optional(),
  message: z.string().optional(),
  source: z.string().optional(),
  // ProjectForm fields
  company: z.string().optional(),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  description: z.string().optional(),
  type: z.string().optional(),
  // Optional tracking
  source_url: z.string().optional(),
  utm: z
    .object({
      source: z.string().optional(),
      medium: z.string().optional(),
      campaign: z.string().optional(),
    })
    .optional(),
}).refine(
  (d) => (d.message && d.message.trim().length > 0) || (d.description && d.description.trim().length > 0),
  { message: 'message or description is required' },
);

export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const parsed = ContactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.issues },
        { status: 400 },
      );
    }

    const submissionType = parsed.data.type === 'project' ? 'start-project' : 'contact';
    const division = parsed.data.division || 'parent';

    const result = await processSubmission({
      division,
      type: submissionType,
      data: parsed.data,
      source_url: parsed.data.source_url ?? parsed.data.source,
      utm: parsed.data.utm,
    });

    return NextResponse.json({ success: true, ...result }, { status: 201 });
  } catch (err) {
    console.error('[API ERROR] /api/contact', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
