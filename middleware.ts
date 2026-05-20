import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Redirect faindable.app → faindable.app/en
// All other locale routing handled by next-intl

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Already has a locale prefix — let next-intl handle it
  if (pathname.startsWith('/en') || pathname.startsWith('/bg')) {
    return NextResponse.next()
  }

  // Skip API routes, static files, _next
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Root or anything without locale prefix → redirect to /en
  const url = request.nextUrl.clone()
  url.pathname = '/en' + pathname
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
