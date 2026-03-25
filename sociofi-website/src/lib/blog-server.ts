// Server-only — uses Supabase server client.
// Never import this file in client components.

import { createClient } from '@/lib/supabase/server'
import {
  getAllPosts as getAllPostsStatic,
  getAllAuthors,
  getPostBySlug as getPostBySlugStatic,
  type BlogPost,
  type BlogAuthor,
  type BlogCategory,
} from './blog'

export { CATEGORY_CONFIG, formatPostDate } from './blog'
export type { BlogPost } from './blog'

// ── DB row type ────────────────────────────────────────────────────────────────

interface CmsPostRow {
  id: string
  type: string
  status: string
  title: string
  slug: string
  excerpt: string | null
  body: string | null
  content_json: unknown
  division: string | null
  author: string
  author_type: 'human' | 'agent'
  edited_by: string | null
  tags: string[]
  featured: boolean
  word_count: number
  published_at: string | null
  created_at: string
  updated_at: string
}

// ── Mapping ────────────────────────────────────────────────────────────────────

function authorFromName(name: string, authorType: 'human' | 'agent'): BlogAuthor {
  const authors = getAllAuthors()

  // Try to match known authors first
  const known = authors.find(
    (a: BlogAuthor) => a.name.toLowerCase() === name.toLowerCase() || a.slug === name.toLowerCase()
  )
  if (known) return known

  // SCRIBE agent fallback
  if (authorType === 'agent' || name.toUpperCase() === 'SCRIBE') {
    return authors.find((a: BlogAuthor) => a.slug === 'scribe') ?? authors[0]
  }

  // Generic human author
  return {
    slug: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    role: 'SocioFi Team',
    type: 'human',
    avatarInitials: name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase(),
    accentColor: '#59A392',
    bio: '',
    divisions: [],
  }
}

/** Infer a BlogCategory from cms_posts.type */
function inferCategory(type: string): BlogCategory {
  const map: Record<string, BlogCategory> = {
    blog_post: 'ai-development',
    case_study: 'case-studies',
    experiment: 'experiments',
    open_source: 'engineering',
    course: 'tutorials',
    workshop: 'tutorials',
  }
  return (map[type] as BlogCategory) ?? 'ai-development'
}

/** Estimate reading time from word count */
function readingTime(wordCount: number): string {
  const mins = Math.max(1, Math.ceil(wordCount / 200))
  return `${mins} min read`
}

function mapRow(row: CmsPostRow): BlogPost {
  const author = authorFromName(row.author, row.author_type)
  const category = inferCategory(row.type)

  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? '',
    body: row.body ?? '',
    category,
    divisions: row.division ? [row.division] : [],
    author,
    authorType: row.author_type === 'agent' ? 'ai_agent' : 'human',
    editedBy: row.edited_by ?? undefined,
    publishedAt: row.published_at ?? row.created_at,
    readingTime: readingTime(row.word_count ?? 0),
    tags: row.tags ?? [],
    featured: row.featured ?? false,
    canonicalUrl: `/blog/${row.slug}`,
  }
}

// ── Public async API ───────────────────────────────────────────────────────────

/**
 * Fetch a single published post by slug.
 * Tries cms_posts first, falls back to static POSTS data.
 */
export async function getPostBySlugAsync(slug: string): Promise<BlogPost | undefined> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('cms_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (!error && data) return mapRow(data as CmsPostRow)
  } catch {
    // Supabase unavailable — fall through to static
  }

  return getPostBySlugStatic(slug)
}

/**
 * Fetch all published posts, DB first then merged with static posts.
 * Static posts are shown as fallback when DB is empty (dev environment).
 */
export async function getAllPostsAsync(filters?: {
  division?: string
  category?: BlogCategory
  author?: string
}): Promise<BlogPost[]> {
  let dbPosts: BlogPost[] = []

  try {
    const supabase = await createClient()
    let query = supabase
      .from('cms_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    if (filters?.division) query = query.eq('division', filters.division)

    const { data, error } = await query
    if (!error && data && data.length > 0) {
      dbPosts = (data as CmsPostRow[]).map(mapRow)
      // Apply category + author filters (not in DB query — no category column yet)
      if (filters?.category) dbPosts = dbPosts.filter((p) => p.category === filters.category)
      if (filters?.author) dbPosts = dbPosts.filter((p) => p.author.slug === filters.author)
    }
  } catch {
    // Fall through to static only
  }

  // When DB has posts, use DB only. When empty (dev), fall back to static.
  if (dbPosts.length > 0) return dbPosts

  // Static fallback — uses the already-filtered + sorted getAllPostsStatic
  return getAllPostsStatic(filters)
}

/**
 * Fetch related posts for a given post (DB-aware).
 * Uses DB posts if available, otherwise static.
 */
export async function getRelatedPostsAsync(post: BlogPost, limit = 3): Promise<BlogPost[]> {
  const all = await getAllPostsAsync()
  const candidates = all
    .filter((p) => p.slug !== post.slug)
    .map((p) => {
      let score = 0
      if (p.category === post.category) score += 3
      p.divisions.forEach((d) => { if (post.divisions.includes(d)) score += 2 })
      p.tags.forEach((t) => { if (post.tags.includes(t)) score += 1 })
      return { post: p, score }
    })
  return candidates.sort((a, b) => b.score - a.score).slice(0, limit).map((c) => c.post)
}

