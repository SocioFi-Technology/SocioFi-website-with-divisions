import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const UpdateTicketStatusSchema = z.object({
  status: z.enum(['open', 'acknowledged', 'in_progress', 'resolved', 'closed']),
  resolution_notes: z.string().optional(),
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
      return NextResponse.json({ error: 'Missing ticket ID' }, { status: 400 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const parsed = UpdateTicketStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.issues },
        { status: 400 },
      );
    }

    const updateData: Record<string, unknown> = {
      status: parsed.data.status,
    };

    if (parsed.data.status === 'acknowledged') {
      updateData.acknowledged_at = new Date().toISOString();
    }

    if (parsed.data.status === 'resolved' || parsed.data.status === 'closed') {
      updateData.resolved_at = new Date().toISOString();
    }

    if (parsed.data.resolution_notes !== undefined) {
      updateData.resolution_notes = parsed.data.resolution_notes;
    }

    const { data: ticket, error } = await supabase
      .from('tickets')
      .update(updateData)
      .eq('id', id)
      .select('id, status')
      .single();

    if (error) {
      console.error('[API ERROR] /api/admin/tickets/[id]/status Supabase error:', error);
      return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 });
    }

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, ticket }, { status: 200 });
  } catch (err) {
    console.error('[API ERROR] /api/admin/tickets/[id]/status', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
