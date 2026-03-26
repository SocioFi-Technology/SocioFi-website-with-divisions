import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

// POST /api/revalidate
// Called by apps/cms when content is published/updated
// Body: { paths?: string[], tags?: string[], division?: string, type?: string }
// Header: x-revalidate-secret: <REVALIDATE_SECRET env var>
export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-revalidate-secret')
  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid revalidation secret' }, { status: 401 })
  }

  try {
    const body = await req.json().catch(() => ({}))
    const { paths, tags, division, type } = body as {
      paths?: string[]
      tags?: string[]
      division?: string
      type?: string
    }

    const revalidated: { paths: string[]; tags: string[] } = { paths: [], tags: [] }

    // Revalidate explicit tags
    // Next.js 16: revalidateTag requires a second `profile` argument
    if (Array.isArray(tags)) {
      for (const tag of tags) {
        revalidateTag(tag, 'default')
        revalidated.tags.push(tag)
      }
    }

    // Revalidate explicit paths
    if (Array.isArray(paths)) {
      for (const path of paths) {
        revalidatePath(path)
        revalidated.paths.push(path)
      }
    }

    // Smart revalidation based on content type
    if (type === 'blog_post' || type === 'post' || !type) {
      revalidatePath('/blog')
      revalidated.paths.push('/blog')

      if (division) {
        revalidatePath(`/${division}/blog`)
        revalidated.paths.push(`/${division}/blog`)
      }
    }

    if (type === 'course' || type === 'workshop') {
      revalidatePath('/academy')
      revalidatePath('/academy/courses')
      revalidated.paths.push('/academy', '/academy/courses')
    }

    if (type === 'faq') {
      if (division) {
        revalidatePath(`/${division}`)
        revalidated.paths.push(`/${division}`)
      }
    }

    if (type === 'testimonial') {
      revalidatePath('/')
      revalidated.paths.push('/')
    }

    if (type === 'portfolio' || type === 'case_study') {
      revalidatePath('/studio/portfolio')
      revalidated.paths.push('/studio/portfolio')
    }

    return NextResponse.json({
      revalidated: true,
      timestamp: new Date().toISOString(),
      ...revalidated,
    })
  } catch (err) {
    console.error('[revalidate] error:', err)
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 })
  }
}

// GET /api/revalidate — health check (no auth required)
export async function GET() {
  return NextResponse.json({ ok: true, endpoint: 'revalidate' })
}
