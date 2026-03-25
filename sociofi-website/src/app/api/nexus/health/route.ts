import { NextResponse } from 'next/server'

/**
 * GET /api/nexus/health
 * Pings the NEXUS FastAPI server and returns its status.
 * Used by the admin dashboard to show "Agent system offline" banner.
 */
export async function GET() {
  const nexusUrl = process.env.NEXUS_API_URL ?? 'http://localhost:8001'
  const nexusKey = process.env.NEXUS_API_KEY ?? ''

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)

    const res = await fetch(`${nexusUrl}/health`, {
      method: 'GET',
      headers: { 'X-API-Key': nexusKey },
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (!res.ok) {
      return NextResponse.json({ online: false, error: `NEXUS returned ${res.status}` }, { status: 200 })
    }

    const data = await res.json() as Record<string, unknown>
    return NextResponse.json({
      online: true,
      agents: (data.agents as number) ?? 0,
      version: (data.version as string) ?? 'unknown',
      uptime: (data.uptime as number) ?? 0,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Connection refused'
    return NextResponse.json({ online: false, error: message }, { status: 200 })
  }
}
