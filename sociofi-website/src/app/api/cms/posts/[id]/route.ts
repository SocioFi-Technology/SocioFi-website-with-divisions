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
    const { data: post, error } = await supabase
      .from('cms_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (err) {
    console.error('[API ERROR] GET /api/cms/posts/[id]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Auth check
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

    // Fetch existing post to check published_at
    const { data: existing, error: fetchError } = await supabase
      .from('cms_posts')
      .select('status, published_at')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const updates = body as Record<string, unknown>;

    // If status changes to published and published_at was null, set it now
    if (
      updates.status === 'published' &&
      existing.status !== 'published' &&
      !existing.published_at
    ) {
      updates.published_at = new Date().toISOString();
    }

    const { data: post, error } = await supabase
      .from('cms_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[API ERROR] PUT /api/cms/posts/[id]', error);
      return NextResponse.json({ error: 'Failed to update post', detail: error.message }, { status: 500 });
    }

    return NextResponse.json({ post });
  } catch (err) {
    console.error('[API ERROR] PUT /api/cms/posts/[id]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Auth check
    const authClient = await createAuthClient();
    const { data: { user } } = await authClient.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const supabase = getServiceClient();

    const { error } = await supabase
      .from('cms_posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[API ERROR] DELETE /api/cms/posts/[id]', error);
      return NextResponse.json({ error: 'Failed to delete post', detail: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[API ERROR] DELETE /api/cms/posts/[id]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
