import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

type TableEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*'

interface Subscription {
  table: string
  event?: TableEvent
  filter?: string
  callback: (payload: Record<string, unknown>) => void
}

export function useRealtime(subscriptions: Subscription[]) {
  const channelRef = useRef<RealtimeChannel | null>(null)

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase.channel('admin-dashboard')

    subscriptions.forEach(sub => {
      channel.on(
        'postgres_changes' as Parameters<typeof channel.on>[0],
        {
          event: sub.event ?? '*',
          schema: 'public',
          table: sub.table,
          ...(sub.filter ? { filter: sub.filter } : {}),
        },
        sub.callback
      )
    })

    channel.subscribe()
    channelRef.current = channel

    return () => {
      supabase.removeChannel(channel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
