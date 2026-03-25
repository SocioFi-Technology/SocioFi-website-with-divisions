/**
 * Next.js Middleware — Subdomain Routing
 *
 * superadmin.sociofitechnology.com  →  serves /admin/* routes
 * sociofitechnology.com             →  serves public site as normal
 *
 * How it works:
 *   superadmin.sociofitechnology.com/          → rewrite to /admin
 *   superadmin.sociofitechnology.com/login     → rewrite to /admin/login
 *   superadmin.sociofitechnology.com/contacts  → rewrite to /admin/contacts
 *   superadmin.sociofitechnology.com/admin/*   → pass through (already prefixed)
 *
 * No code changes needed in admin pages — they still use /admin/* hrefs internally.
 * The middleware transparently maps the subdomain to the /admin route group.
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') ?? ''

  // Match superadmin subdomain in any environment:
  //   superadmin.sociofitechnology.com  (production)
  //   superadmin.localhost:3000          (local dev with hosts file)
  const isAdminSubdomain = hostname.startsWith('superadmin.')

  if (isAdminSubdomain) {
    const { pathname } = request.nextUrl

    // Pass through Next.js internals and static assets
    if (
      pathname.startsWith('/_next/') ||
      pathname.startsWith('/favicon') ||
      pathname === '/robots.txt' ||
      pathname === '/sitemap.xml' ||
      pathname === '/manifest.json'
    ) {
      return NextResponse.next()
    }

    // Pass through API routes unchanged — they handle their own auth
    if (pathname.startsWith('/api/')) {
      return NextResponse.next()
    }

    // Already prefixed — serve as-is to avoid /admin/admin double-prefix
    if (pathname.startsWith('/admin')) {
      return NextResponse.next()
    }

    // Rewrite subdomain root and all other paths into /admin/*
    const url = request.nextUrl.clone()
    url.pathname = pathname === '/' ? '/admin' : `/admin${pathname}`
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static  (static files)
     * - _next/image   (image optimization)
     * - favicon.ico
     */
    '/((?!_next/static|_next/image|favicon\\.ico).*)',
  ],
}
