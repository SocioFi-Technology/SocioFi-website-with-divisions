'use client'
/**
 * Polls /api/nexus/health every 30s.
 * Returns { online, checking, agents, error } for the admin offline banner.
 */
import { useState, useEffect, useCallback } from 'react'

export interface NexusStatus {
  online: boolean
  checking: boolean
  agents: number
  error: string | null
  lastChecked: Date | null
}

const POLL_INTERVAL = 30_000  // 30 seconds

export function useNexusStatus(): NexusStatus & { recheck: () => void } {
  const [status, setStatus] = useState<NexusStatus>({
    online: true,     // optimistic default — no banner flash on load
    checking: true,
    agents: 0,
    error: null,
    lastChecked: null,
  })

  const check = useCallback(async () => {
    try {
      const res = await fetch('/api/nexus/health', { cache: 'no-store' })
      const data = await res.json() as { online: boolean; agents?: number; error?: string }
      setStatus({
        online: data.online,
        checking: false,
        agents: data.agents ?? 0,
        error: data.online ? null : (data.error ?? 'Unreachable'),
        lastChecked: new Date(),
      })
    } catch {
      setStatus(prev => ({
        ...prev, online: false, checking: false,
        error: 'Health check failed', lastChecked: new Date(),
      }))
    }
  }, [])

  useEffect(() => {
    check()
    const interval = setInterval(check, POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [check])

  return { ...status, recheck: check }
}
