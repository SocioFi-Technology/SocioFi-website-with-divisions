import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Subdomain routing for SocioFi division sites.
 *
 * superadmin.sociofitechnology.com → /admin/...
 * labs.sociofitechnology.com       → /labs/...
 * academy.sociofitechnology.com    → /academy/...
 * cloud.sociofitechnology.com      → /cloud/...
 * ventures.sociofitechnology.com   → /ventures/...
 *
 * The main site (sociofitechnology.com / www.) is unaffected.
 *
 * Also protects /admin routes — redirects unauthenticated users to /admin/login.
 */

const SUBDOMAIN_ROUTES: Record<string, string> = {
  superadmin: '/admin',
  labs:       '/labs',
  academy:    '/academy',
  cloud:      '/cloud',
  ventures:   '/ventures',
};

async function handleAdminAuth(request: NextRequest): Promise<NextResponse | null> {
  const { pathname } = request.nextUrl;

  // Gate /admin and /cms routes (except /admin/login itself)
  const isProtected = pathname.startsWith('/admin') || pathname.startsWith('/cms');
  const isLoginPage = pathname.startsWith('/admin/login');
  if (!isProtected || isLoginPage) {
    return null;
  }

  const fwdHeaders = new Headers(request.headers);
  fwdHeaders.set('x-pathname', pathname);
  let response = NextResponse.next({ request: { headers: fwdHeaders } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }

  return response;
}

export async function proxy(request: NextRequest) {
  // 1. Admin auth guard
  const adminResponse = await handleAdminAuth(request);
  if (adminResponse) return adminResponse;

  // 2. Subdomain routing
  const hostname = request.headers.get('host') ?? '';

  // Extract subdomain: e.g. "labs.sociofitechnology.com" → "labs"
  // Works for *.sociofitechnology.com and *.vercel.app preview URLs.
  const subdomain = hostname.split('.')[0].toLowerCase();
  const prefix = SUBDOMAIN_ROUTES[subdomain];

  if (!prefix) {
    // Not a division subdomain — serve normally, but forward pathname header
    const fwdHeaders = new Headers(request.headers);
    fwdHeaders.set('x-pathname', request.nextUrl.pathname);
    return NextResponse.next({ request: { headers: fwdHeaders } });
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
