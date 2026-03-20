import { NextRequest, NextResponse } from 'next/server';
import { createClient as createAuthClient } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const division = searchParams.get('division');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const supabase = getServiceClient();
    let query = supabase.from('cms_posts').select('*', { count: 'exact' });

    if (division) query = query.eq('division', division);
    if (status) query = query.eq('status', status);
    if (search) {
      query = query.or(
        `title.ilike.%${search}%,excerpt.ilike.%${search}%`,
      );
    }

    query = query.order('created_at', { ascending: false });

    const { data: posts, error, count } = await query;

    if (error) {
      console.error('[API ERROR] GET /api/cms/posts', error);
      return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }

    return NextResponse.json({ posts: posts ?? [], total: count ?? 0 });
  } catch (err) {
    console.error('[API ERROR] GET /api/cms/posts', err);
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
      slug: rawSlug,
      body: postBody,
      excerpt,
      status,
      division,
      author,
      tags,
      cover_image,
    } = body as Record<string, unknown>;

    if (!title || typeof title !== 'string') {
      return NextResponse.json({ error: 'title is required' }, { status: 400 });
    }

    const slug = (rawSlug && typeof rawSlug === 'string' && rawSlug.trim())
      ? rawSlug.trim()
      : slugify(title);

    const insertData: Record<string, unknown> = {
      title,
      slug,
      body: postBody ?? '',
      excerpt: excerpt ?? '',
      status: status ?? 'draft',
      division: division ?? 'parent',
      author: author ?? '',
      tags: tags ?? [],
      cover_image: cover_image ?? null,
    };

    if (status === 'published') {
      insertData.published_at = new Date().toISOString();
    }

    const supabase = getServiceClient();
    const { data: post, error } = await supabase
      .from('cms_posts')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('[API ERROR] POST /api/cms/posts', error);
      return NextResponse.json({ error: 'Failed to create post', detail: error.message }, { status: 500 });
    }

    return NextResponse.json({ post }, { status: 201 });
  } catch (err) {
    console.error('[API ERROR] POST /api/cms/posts', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
