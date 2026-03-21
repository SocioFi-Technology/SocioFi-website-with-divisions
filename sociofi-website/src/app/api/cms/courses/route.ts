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
      return NextResponse.json({ courses: [], total: 0, source: 'mock' });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const audience = searchParams.get('audience');

    const supabase = getServiceClient();
    let query = supabase.from('cms_courses').select('*', { count: 'exact' });

    if (status) query = query.eq('status', status);
    if (category) query = query.eq('category', category);
    if (audience) query = query.eq('audience', audience);

    query = query.order('created_at', { ascending: false });

    const { data: courses, error, count } = await query;

    if (error) {
      console.error('[API ERROR] GET /api/cms/courses', error);
      return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
    }

    return NextResponse.json({ courses: courses ?? [], total: count ?? 0 });
  } catch (err) {
    console.error('[API ERROR] GET /api/cms/courses', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Auth check
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

    const {
      title,
      slug,
      description,
      price,
      duration,
      duration_minutes,
      category,
      audience,
      status,
      outcomes,
      modules,
      thumbnail_gradient,
    } = body as Record<string, unknown>;

    if (!title || typeof title !== 'string') {
      return NextResponse.json({ error: 'title is required' }, { status: 400 });
    }

    const insertData: Record<string, unknown> = {
      title,
      slug: slug ?? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: description ?? '',
      price: price ?? 0,
      duration: duration ?? '',
      duration_minutes: duration_minutes ?? 0,
      category: category ?? '',
      audience: audience ?? '',
      status: status ?? 'draft',
      outcomes: outcomes ?? [],
      modules: modules ?? [],
      thumbnail_gradient: thumbnail_gradient ?? null,
    };

    const supabase = getServiceClient();
    const { data: course, error } = await supabase
      .from('cms_courses')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('[API ERROR] POST /api/cms/courses', error);
      return NextResponse.json({ error: 'Failed to create course', detail: error.message }, { status: 500 });
    }

    return NextResponse.json({ course }, { status: 201 });
  } catch (err) {
    console.error('[API ERROR] POST /api/cms/courses', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
