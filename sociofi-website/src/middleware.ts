import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_URL = 'https://admin.sociofitechnology.com';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect all /admin routes to VPS-hosted admin portal
  if (pathname.startsWith('/admin')) {
    const adminPath = pathname.replace(/^\/admin/, '') || '/';
    return NextResponse.redirect(`${ADMIN_URL}${adminPath}`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
