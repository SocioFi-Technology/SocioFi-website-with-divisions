import { NextRequest, NextResponse } from 'next/server';
import { createClient as createAuthClient } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const supabase = getServiceClient();
    const { data: course, error } = await supabase
      .from('cms_courses')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json({ course });
  } catch (err) {
    console.error('[API ERROR] GET /api/cms/courses/[id]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authClient = await createAuthClient();
    const { data: { user } } = await authClient.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const supabase = getServiceClient();
    const { data: course, error } = await supabase
      .from('cms_courses')
      .update(body as Record<string, unknown>)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[API ERROR] PUT /api/cms/courses/[id]', error);
      return NextResponse.json({ error: 'Failed to update course', detail: error.message }, { status: 500 });
    }

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json({ course });
  } catch (err) {
    console.error('[API ERROR] PUT /api/cms/courses/[id]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authClient = await createAuthClient();
    const { data: { user } } = await authClient.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const supabase = getServiceClient();

    const { error } = await supabase
      .from('cms_courses')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[API ERROR] DELETE /api/cms/courses/[id]', error);
      return NextResponse.json({ error: 'Failed to delete course', detail: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[API ERROR] DELETE /api/cms/courses/[id]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
