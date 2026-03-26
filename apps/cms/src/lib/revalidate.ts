// Calls the main website's revalidation endpoint after content is published.
// NEXT_PUBLIC_WEBSITE_URL must point to the main site (e.g. https://sociofitechnology.com in prod,
// http://localhost:3000 in dev).

const WEBSITE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL ?? 'http://localhost:3000'
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET ?? ''

interface RevalidateOptions {
  type?: string
  division?: string
  paths?: string[]
  tags?: string[]
}

export async function triggerRevalidation(options: RevalidateOptions = {}): Promise<boolean> {
  if (!REVALIDATE_SECRET) {
    console.warn('[revalidate] REVALIDATE_SECRET not set — skipping revalidation')
    return false
  }

  try {
    const res = await fetch(`${WEBSITE_URL}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-revalidate-secret': REVALIDATE_SECRET,
      },
      body: JSON.stringify(options),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('[revalidate] failed:', res.status, text)
      return false
    }

    const data = await res.json()
    console.log('[revalidate] success:', data)
    return true
  } catch (err) {
    console.error('[revalidate] network error:', err)
    return false
  }
}
