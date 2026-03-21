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
      return NextResponse.json({ items: [], total: 0, source: 'mock' });
    }

    const { searchParams } = new URL(req.url);
    const division = searchParams.get('division');
    const status = searchParams.get('status');

    const supabase = getServiceClient();
    let query = supabase.from('cms_portfolio').select('*', { count: 'exact' });

    if (division) query = query.eq('division', division);
    if (status) query = query.eq('status', status);
    query = query.order('created_at', { ascending: false });

    const { data: items, error, count } = await query;

    if (error) {
      console.error('[API ERROR] GET /api/cms/portfolio', error);
      return NextResponse.json({ error: 'Failed to fetch portfolio items' }, { status: 500 });
    }

    return NextResponse.json({ items: items ?? [], total: count ?? 0 });
  } catch (err) {
    console.error('[API ERROR] GET /api/cms/portfolio', err);
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

    const { title, slug, client, division, category, description, outcomes, cover_image, status } = body as Record<string, unknown>;

    if (!title || typeof title !== 'string') {
      return NextResponse.json({ error: 'title is required' }, { status: 400 });
    }

    const insertData: Record<string, unknown> = {
      title,
      slug: slug ?? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      client: client ?? '',
      division: division ?? 'parent',
      category: category ?? '',
      description: description ?? '',
      outcomes: outcomes ?? [],
      cover_image: cover_image ?? null,
      status: status ?? 'draft',
    };

    const supabase = getServiceClient();
    const { data: item, error } = await supabase
      .from('cms_portfolio')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('[API ERROR] POST /api/cms/portfolio', error);
      return NextResponse.json({ error: 'Failed to create portfolio item', detail: error.message }, { status: 500 });
    }

    return NextResponse.json({ item }, { status: 201 });
  } catch (err) {
    console.error('[API ERROR] POST /api/cms/portfolio', err);
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
    const { data: item, error } = await supabase
      .from('cms_portfolio')
      .update(fields)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[API ERROR] PUT /api/cms/portfolio', error);
      return NextResponse.json({ error: 'Failed to update portfolio item', detail: error.message }, { status: 500 });
    }

    if (!item) {
      return NextResponse.json({ error: 'Portfolio item not found' }, { status: 404 });
    }

    return NextResponse.json({ item });
  } catch (err) {
    console.error('[API ERROR] PUT /api/cms/portfolio', err);
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
    const { error } = await supabase.from('cms_portfolio').delete().eq('id', id);

    if (error) {
      console.error('[API ERROR] DELETE /api/cms/portfolio', error);
      return NextResponse.json({ error: 'Failed to delete portfolio item', detail: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[API ERROR] DELETE /api/cms/portfolio', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
