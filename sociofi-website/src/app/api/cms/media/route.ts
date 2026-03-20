import { NextRequest, NextResponse } from 'next/server';
import { createClient as createAuthClient } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function GET() {
  try {
    const supabase = getServiceClient();
    const { data: files, error } = await supabase
      .from('cms_media')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[API ERROR] GET /api/cms/media', error);
      return NextResponse.json({ error: 'Failed to fetch media files' }, { status: 500 });
    }

    return NextResponse.json({ files: files ?? [] });
  } catch (err) {
    console.error('[API ERROR] GET /api/cms/media', err);
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

    let formData: FormData;
    try {
      formData = await req.formData();
    } catch {
      return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
    }

    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;

    const supabase = getServiceClient();

    const { error: uploadError } = await supabase.storage
      .from('content-images')
      .upload(fileName, buffer, { contentType: file.type });

    if (uploadError) {
      console.error('[API ERROR] POST /api/cms/media storage upload', uploadError);
      return NextResponse.json({ error: 'Failed to upload file', detail: uploadError.message }, { status: 500 });
    }

    const publicUrl = supabase.storage
      .from('content-images')
      .getPublicUrl(fileName).data.publicUrl;

    const { data: mediaRecord, error: insertError } = await supabase
      .from('cms_media')
      .insert({
        filename: fileName,
        original_name: file.name,
        url: publicUrl,
        size: file.size,
        mime_type: file.type,
      })
      .select()
      .single();

    if (insertError) {
      console.error('[API ERROR] POST /api/cms/media insert', insertError);
      return NextResponse.json({ error: 'File uploaded but failed to save record', detail: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ file: mediaRecord }, { status: 201 });
  } catch (err) {
    console.error('[API ERROR] POST /api/cms/media', err);
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

    // Fetch the record first to get the filename for storage deletion
    const { data: record, error: fetchError } = await supabase
      .from('cms_media')
      .select('filename')
      .eq('id', id)
      .single();

    if (fetchError || !record) {
      return NextResponse.json({ error: 'Media file not found' }, { status: 404 });
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('content-images')
      .remove([record.filename]);

    if (storageError) {
      console.error('[API ERROR] DELETE /api/cms/media storage', storageError);
      // Continue to delete DB record even if storage fails
    }

    // Delete from cms_media table
    const { error: deleteError } = await supabase
      .from('cms_media')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('[API ERROR] DELETE /api/cms/media db', deleteError);
      return NextResponse.json({ error: 'Failed to delete media record', detail: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[API ERROR] DELETE /api/cms/media', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
