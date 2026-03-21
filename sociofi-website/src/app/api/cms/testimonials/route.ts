import { NextRequest, NextResponse } from 'next/server';
import { createClient as createAuthClient } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';

function hasSupabase(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function GET(req: NextRequest) {
  try {
    if (!hasSupabase()) {
      return NextResponse.json({ testimonials: [], total: 0, source: 'mock' });
    }

    const { searchParams } = new URL(req.url);
    const division = searchParams.get('division');

    const supabase = getServiceClient();
    let query = supabase.from('cms_testimonials').select('*', { count: 'exact' });

    if (division) query = query.eq('division', division);
    query = query.order('created_at', { ascending: false });

    const { data: testimonials, error, count } = await query;

    if (error) {
      console.error('[API ERROR] GET /api/cms/testimonials', error);
      return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
    }

    return NextResponse.json({ testimonials: testimonials ?? [], total: count ?? 0 });
  } catch (err) {
    console.error('[API ERROR] GET /api/cms/testimonials', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authClient = await createAuthClient();
    const { data: { user } } = await authClient.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { name, title, company, content, rating, division, avatar_url } = body as Record<string, unknown>;

    if (!name || !content) {
      return NextResponse.json({ error: 'name and content are required' }, { status: 400 });
    }

    const supabase = getServiceClient();
    const { data: testimonial, error } = await supabase
      .from('cms_testimonials')
      .insert({ name, title, company, content, rating: rating ?? 5, division: division ?? 'parent', avatar_url: avatar_url ?? null })
      .select()
      .single();

    if (error) {
      console.error('[API ERROR] POST /api/cms/testimonials', error);
      return NextResponse.json({ error: 'Failed to create testimonial', detail: error.message }, { status: 500 });
    }

    return NextResponse.json({ testimonial }, { status: 201 });
  } catch (err) {
    console.error('[API ERROR] POST /api/cms/testimonials', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authClient = await createAuthClient();
    const { data: { user } } = await authClient.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { id, ...fields } = body as Record<string, unknown>;

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    const supabase = getServiceClient();
    const { data: testimonial, error } = await supabase
      .from('cms_testimonials')
      .update(fields)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[API ERROR] PUT /api/cms/testimonials', error);
      return NextResponse.json({ error: 'Failed to update testimonial', detail: error.message }, { status: 500 });
    }

    if (!testimonial) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    return NextResponse.json({ testimonial });
  } catch (err) {
    console.error('[API ERROR] PUT /api/cms/testimonials', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authClient = await createAuthClient();
    const { data: { user } } = await authClient.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'id query param is required' }, { status: 400 });
    }

    const supabase = getServiceClient();
    const { error } = await supabase.from('cms_testimonials').delete().eq('id', id);

    if (error) {
      console.error('[API ERROR] DELETE /api/cms/testimonials', error);
      return NextResponse.json({ error: 'Failed to delete testimonial', detail: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[API ERROR] DELETE /api/cms/testimonials', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
