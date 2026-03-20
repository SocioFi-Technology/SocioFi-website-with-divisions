import { NextRequest, NextResponse } from 'next/server';
import { createClient as createAuthClient } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';

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

    const supabase = getServiceClient();
    let query = supabase.from('cms_pricing').select('*', { count: 'exact' });

    if (division) query = query.eq('division', division);
    query = query.order('created_at', { ascending: true });

    const { data: plans, error, count } = await query;

    if (error) {
      console.error('[API ERROR] GET /api/cms/pricing', error);
      return NextResponse.json({ error: 'Failed to fetch pricing plans' }, { status: 500 });
    }

    return NextResponse.json({ plans: plans ?? [], total: count ?? 0 });
  } catch (err) {
    console.error('[API ERROR] GET /api/cms/pricing', err);
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

    const { division, tier, name, price, billing_period, tagline, features, metadata, is_featured } = body as Record<string, unknown>;

    if (!name || !division) {
      return NextResponse.json({ error: 'name and division are required' }, { status: 400 });
    }

    const insertData: Record<string, unknown> = {
      division,
      tier: tier ?? '',
      name,
      price: price ?? 0,
      billing_period: billing_period ?? 'month',
      tagline: tagline ?? '',
      features: features ?? [],
      metadata: metadata ?? {},
      is_featured: is_featured ?? false,
    };

    const supabase = getServiceClient();
    const { data: plan, error } = await supabase
      .from('cms_pricing')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('[API ERROR] POST /api/cms/pricing', error);
      return NextResponse.json({ error: 'Failed to create pricing plan', detail: error.message }, { status: 500 });
    }

    return NextResponse.json({ plan }, { status: 201 });
  } catch (err) {
    console.error('[API ERROR] POST /api/cms/pricing', err);
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
    const { data: plan, error } = await supabase
      .from('cms_pricing')
      .update(fields)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[API ERROR] PUT /api/cms/pricing', error);
      return NextResponse.json({ error: 'Failed to update pricing plan', detail: error.message }, { status: 500 });
    }

    if (!plan) {
      return NextResponse.json({ error: 'Pricing plan not found' }, { status: 404 });
    }

    return NextResponse.json({ plan });
  } catch (err) {
    console.error('[API ERROR] PUT /api/cms/pricing', err);
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
    const { error } = await supabase.from('cms_pricing').delete().eq('id', id);

    if (error) {
      console.error('[API ERROR] DELETE /api/cms/pricing', error);
      return NextResponse.json({ error: 'Failed to delete pricing plan', detail: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[API ERROR] DELETE /api/cms/pricing', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
