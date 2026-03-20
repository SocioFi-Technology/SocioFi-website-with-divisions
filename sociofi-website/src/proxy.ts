import { NextRequest, NextResponse } from 'next/server';

/**
 * Subdomain routing for SocioFi division sites.
 *
 * labs.sociofitechnology.com      → /labs/...
 * academy.sociofitechnology.com   → /academy/...
 * cloud.sociofitechnology.com     → /cloud/...
 * ventures.sociofitechnology.com  → /ventures/...
 *
 * The main site (sociofitechnology.com / www.) is unaffected.
 */

const SUBDOMAIN_ROUTES: Record<string, string> = {
  labs:     '/labs',
  academy:  '/academy',
  cloud:    '/cloud',
  ventures: '/ventures',
};

export function proxy(request: NextRequest) {
  const hostname = request.headers.get('host') ?? '';

  // Extract subdomain: e.g. "labs.sociofitechnology.com" → "labs"
  // Works for *.sociofitechnology.com and *.vercel.app preview URLs.
  const subdomain = hostname.split('.')[0].toLowerCase();
  const prefix = SUBDOMAIN_ROUTES[subdomain];

  if (!prefix) {
    // Not a division subdomain — serve normally
    return NextResponse.next();
  }

  const { pathname, search } = request.nextUrl;

  // Already prefixed (shouldn't normally happen, but be safe)
  if (pathname.startsWith(prefix)) {
    return NextResponse.next();
  }

  // Root "/" on the subdomain → division homepage (e.g. /labs)
  // Any sub-path → prefix it (e.g. /research → /labs/research)
  const rewritePath = pathname === '/'
    ? prefix
    : `${prefix}${pathname}`;

  const url = request.nextUrl.clone();
  url.pathname = rewritePath;
  url.search = search;

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     * - _next/static (static files)
     * - _next/image  (image optimisation)
     * - api          (API routes)
     * - favicon.ico / robots.txt / sitemap.xml
     * - public assets (png, svg, etc.)
     */
    '/((?!_next/static|_next/image|api|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|woff2?|ttf|otf)).*)',
  ],
};
