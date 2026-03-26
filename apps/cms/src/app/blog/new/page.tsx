'use client'
import { useEffect } from 'react'
import { getSupabaseClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function NewBlogPost() {
  const router = useRouter()
  useEffect(() => {
    async function create() {
      const client = getSupabaseClient()
      if (!client) {
        // dev mode — navigate to a fake ID
        router.push('/blog/new-draft')
        return
      }
      const { data } = await client.from('cms_posts').insert({
        title: 'Untitled Post',
        slug: `untitled-${Date.now()}`,
        status: 'draft',
        author_name: 'SocioFi Team',
        body: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }).select().single()
      if (data) router.push(`/blog/${data.id}`)
    }
    create()
  }, [router])

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>
      Creating post...
    </div>
  )
}
