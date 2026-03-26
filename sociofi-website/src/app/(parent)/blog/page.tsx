import type { Metadata } from 'next'
import { getAllPostsAsync } from '@/lib/blog-server'
import { getFeaturedPost, getAllAuthors } from '@/lib/blog'
import BlogHubClient from './BlogHubClient'

export const revalidate = 60 // ISR: rebuild every 60s

export const metadata: Metadata = {
  title: 'Blog — SocioFi Technology',
  description:
    'Ideas, research, and hard-won lessons on AI-native development, production engineering, and what it takes to turn an AI prototype into a real product.',
  openGraph: {
    title: 'Blog — SocioFi Technology',
    description:
      'Writing from SocioFi Technology on AI-native development and production engineering.',
    type: 'website',
    url: 'https://sociofitechnology.com/blog',
  },
}

export default async function BlogHubPage() {
  const [allPosts, featuredPost, authors] = await Promise.all([
    getAllPostsAsync(),
    Promise.resolve(getFeaturedPost()),
    Promise.resolve(getAllAuthors()),
  ])

  // Most read = first 5 posts (sorted by date desc, or by featured flag)
  const mostRead = allPosts.slice(0, 5)

  // Exclude featured from the grid (it shows separately)
  const gridPosts = allPosts.filter((p) => p.slug !== featuredPost.slug)

  return (
    <BlogHubClient
      initialPosts={gridPosts}
      featuredPost={featuredPost}
      authors={authors}
      mostRead={mostRead}
    />
  )
}
