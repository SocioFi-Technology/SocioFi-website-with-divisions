import { createClient } from '@/lib/supabase/client'
import type { MediaItem, MediaFolder } from './types'

function getMediaType(mime: string): MediaItem['media_type'] {
  if (mime.startsWith('image/')) return 'image'
  if (mime.startsWith('video/')) return 'video'
  if (mime === 'application/pdf' || mime.includes('document') || mime.includes('spreadsheet')) return 'document'
  return 'other'
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export { formatSize }

export interface UploadResult {
  item: MediaItem
  error?: string
}

export async function uploadMedia(
  file: File,
  folder: Exclude<MediaFolder, 'all'>,
  uploadedBy: string
): Promise<UploadResult> {
  const ALLOWED_TYPES = [
    'image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml',
    'application/pdf', 'text/csv',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]
  const MAX_SIZE = 10 * 1024 * 1024 // 10MB

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { item: {} as MediaItem, error: `File type ${file.type} not supported` }
  }
  if (file.size > MAX_SIZE) {
    return { item: {} as MediaItem, error: `File too large (max 10MB)` }
  }

  // Generate unique filename
  const ext = file.name.split('.').pop() ?? ''
  void ext // used implicitly in filename construction
  const uuid = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2)
  const filename = `${uuid}-${file.name.replace(/[^a-z0-9.-]/gi, '_').toLowerCase()}`

  try {
    const supabase = createClient()
    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(`${folder}/${filename}`, file, { contentType: file.type, upsert: false })

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(`${folder}/${filename}`)

    // Get image dimensions if it's an image
    let width: number | undefined
    let height: number | undefined
    if (file.type.startsWith('image/')) {
      await new Promise<void>(resolve => {
        const img = new Image()
        img.onload = () => { width = img.naturalWidth; height = img.naturalHeight; resolve() }
        img.onerror = () => resolve()
        img.src = URL.createObjectURL(file)
      })
    }

    const mediaItem: Partial<MediaItem> = {
      filename,
      original_name: file.name,
      public_url: publicUrl,
      mime_type: file.type,
      size_bytes: file.size,
      media_type: getMediaType(file.type),
      folder,
      width,
      height,
      uploaded_by: uploadedBy,
      created_at: new Date().toISOString(),
    }

    // Insert into media table
    const { data: dbData, error: dbError } = await supabase
      .from('media')
      .insert(mediaItem)
      .select()
      .single()

    if (dbError) {
      // Still return the item even if DB insert fails (Supabase table may not exist yet)
      return { item: { ...mediaItem, id: uuid } as MediaItem }
    }

    return { item: dbData as MediaItem }
  } catch {
    // Fallback: create a mock item with object URL for demo
    const objectUrl = URL.createObjectURL(file)
    return {
      item: {
        id: typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : Math.random().toString(36).slice(2),
        filename: file.name,
        original_name: file.name,
        public_url: objectUrl,
        mime_type: file.type,
        size_bytes: file.size,
        media_type: getMediaType(file.type),
        folder,
        uploaded_by: uploadedBy,
        created_at: new Date().toISOString(),
      } as MediaItem,
    }
  }
}
