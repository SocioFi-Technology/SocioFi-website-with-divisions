import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const UpdateStatusSchema = z.object({
  status: z.enum(['new', 'reviewed', 'in_progress', 'converted', 'closed', 'archived']),
  notes: z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createClient();

    // Auth check
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Missing submission ID' }, { status: 400 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const parsed = UpdateStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.issues },
        { status: 400 },
      );
    }

    const updateData: Record<string, unknown> = {
      status: parsed.data.status,
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
    };

    if (parsed.data.notes !== undefined) {
      updateData.notes = parsed.data.notes;
    }

    const { data: submission, error } = await supabase
      .from('submissions')
      .update(updateData)
      .eq('id', id)
      .select('id, status')
      .single();

    if (error) {
      console.error('[API ERROR] /api/admin/submissions/[id]/status Supabase error:', error);
      return NextResponse.json({ error: 'Failed to update submission' }, { status: 500 });
    }

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, submission }, { status: 200 });
  } catch (err) {
    console.error('[API ERROR] /api/admin/submissions/[id]/status', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
