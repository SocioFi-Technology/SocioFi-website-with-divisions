'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ContentPostsPage() {
  const router = useRouter()
  useEffect(() => { router.replace('/admin/content?type=blog_post') }, [router])
  return null
}
