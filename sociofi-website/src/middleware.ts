import { NextRequest, NextResponse } from 'next/server';

// ── Canonical domain redirect ──────────────────────────────────────────────────
// Redirects any non-canonical host (vercel.app preview URLs, old domains, etc.)
// to sociofitechnology.com so Google only indexes the real domain.

const CANONICAL_HOST = 'sociofitechnology.com';

// Hosts that should never be redirected (local dev, CI)
const DEV_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0'];

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';

  // Never redirect in local development
  if (DEV_HOSTS.some(h => host.startsWith(h))) {
    return NextResponse.next();
  }

  // If already on the canonical domain, pass through
  if (host === CANONICAL_HOST || host === `www.${CANONICAL_HOST}`) {
    return NextResponse.next();
  }

  // All other hosts (*.vercel.app, preview deployments, old domains) → 301
  const url = request.nextUrl.clone();
  url.protocol = 'https:';
  url.host = CANONICAL_HOST;
  url.port = '';

  return NextResponse.redirect(url, { status: 301 });
}

export const config = {
  matcher: [
    // Run on all routes except Next.js internals and static assets
    '/((?!_next/static|_next/image|_vercel|.*\.(?:ico|svg|png|jpg|jpeg|gif|webp|woff2?|ttf|otf)$).*)',
  ],
};
