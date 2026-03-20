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
    let query = supabase.from('cms_faqs').select('*', { count: 'exact' });

    if (division) query = query.eq('division', division);
    query = query.order('order_index', { ascending: true });

    const { data: faqs, error, count } = await query;

    if (error) {
      console.error('[API ERROR] GET /api/cms/faqs', error);
      return NextResponse.json({ error: 'Failed to fetch FAQs' }, { status: 500 });
    }

    return NextResponse.json({ faqs: faqs ?? [], total: count ?? 0 });
  } catch (err) {
    console.error('[API ERROR] GET /api/cms/faqs', err);
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

    const { division, question, answer, order_index } = body as Record<string, unknown>;

    if (!question || !answer) {
      return NextResponse.json({ error: 'question and answer are required' }, { status: 400 });
    }

    const supabase = getServiceClient();
    const { data: faq, error } = await supabase
      .from('cms_faqs')
      .insert({ division: division ?? 'parent', question, answer, order_index: order_index ?? 0 })
      .select()
      .single();

    if (error) {
      console.error('[API ERROR] POST /api/cms/faqs', error);
      return NextResponse.json({ error: 'Failed to create FAQ', detail: error.message }, { status: 500 });
    }

    return NextResponse.json({ faq }, { status: 201 });
  } catch (err) {
    console.error('[API ERROR] POST /api/cms/faqs', err);
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
    const { data: faq, error } = await supabase
      .from('cms_faqs')
      .update(fields)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[API ERROR] PUT /api/cms/faqs', error);
      return NextResponse.json({ error: 'Failed to update FAQ', detail: error.message }, { status: 500 });
    }

    if (!faq) {
      return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
    }

    return NextResponse.json({ faq });
  } catch (err) {
    console.error('[API ERROR] PUT /api/cms/faqs', err);
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
    const { error } = await supabase.from('cms_faqs').delete().eq('id', id);

    if (error) {
      console.error('[API ERROR] DELETE /api/cms/faqs', error);
      return NextResponse.json({ error: 'Failed to delete FAQ', detail: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[API ERROR] DELETE /api/cms/faqs', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
