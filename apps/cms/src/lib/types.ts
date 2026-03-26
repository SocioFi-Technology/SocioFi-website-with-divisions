export type Division =
  | 'parent'
  | 'studio'
  | 'services'
  | 'labs'
  | 'products'
  | 'academy'
  | 'ventures'
  | 'cloud'
  | 'agents'

export type ContentStatus = 'draft' | 'review' | 'published' | 'archived'

export type PostType =
  | 'blog_post'
  | 'case_study'
  | 'announcement'
  | 'tutorial'
  | 'research'
  | 'project_update'

export interface CMSPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  body?: string
  body_json?: Record<string, unknown>
  status: ContentStatus
  type?: PostType
  division?: Division
  author_name?: string
  author_id?: string
  featured_image?: string
  tags?: string[]
  seo_title?: string
  seo_description?: string
  seo_keywords?: string[]
  published_at?: string
  created_at: string
  updated_at?: string
  metadata?: Record<string, unknown>
  word_count?: number
  read_time?: number
}

export interface CMSCourse {
  id: string
  title: string
  slug: string
  description?: string
  category?: string
  audience?: string
  duration?: string
  price?: number
  currency?: string
  status: ContentStatus
  level?: 'beginner' | 'intermediate' | 'advanced'
  outcomes?: string[]
  modules?: CourseModule[]
  instructor_name?: string
  instructor_bio?: string
  featured_image?: string
  enrollment_count?: number
  created_at: string
  updated_at?: string
}

export interface CourseModule {
  title: string
  lessons: string[]
  duration?: string
}

export interface CMSWorkshop {
  id: string
  title: string
  slug: string
  description?: string
  date: string
  time?: string
  duration?: string
  price?: number
  currency?: string
  seats?: number
  seats_remaining?: number
  location?: string
  is_online: boolean
  meeting_url?: string
  instructor_name?: string
  status: ContentStatus
  created_at: string
}

export interface CMSPortfolio {
  id: string
  title: string
  slug: string
  client_name?: string
  description?: string
  body?: string
  division?: Division
  tags?: string[]
  outcomes?: string[]
  featured_image?: string
  gallery?: string[]
  status: ContentStatus
  type?: 'case_study' | 'project' | 'investment' | 'product'
  metrics?: Array<{ label: string; value: string }>
  url?: string
  created_at: string
  updated_at?: string
}

export interface CMSPricing {
  id: string
  name: string
  slug: string
  division: Division
  price: number
  billing_period?: string
  currency?: string
  description?: string
  features?: string[]
  is_featured?: boolean
  cta_text?: string
  status: ContentStatus
  created_at: string
  updated_at?: string
}

export interface CMSFAQ {
  id: string
  question: string
  answer: string
  division: Division
  order_index?: number
  status: ContentStatus
  created_at: string
  updated_at?: string
}

export interface CMSTestimonial {
  id: string
  name: string
  title?: string
  company?: string
  content: string
  rating?: number
  division?: Division
  avatar_url?: string
  status: ContentStatus
  created_at: string
}

export interface CMSMedia {
  id: string
  filename: string
  url: string
  size?: number
  type?: string
  alt?: string
  width?: number
  height?: number
  created_at: string
}

export interface DashboardStats {
  total_posts: number
  total_courses: number
  total_faqs: number
  total_testimonials: number
  total_portfolio: number
  total_media: number
  published_posts: number
  draft_posts: number
}
