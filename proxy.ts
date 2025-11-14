import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('accessToken')?.value;

  // Redirect root
  if (pathname === '/') {
    return NextResponse.redirect(
      new URL(token ? '/dashboard' : '/login', request.url)
    );
  }

  // Public routes - redirect to dashboard if already authenticated
  if (pathname === '/login') {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Protected routes - require token
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Token exists - let the page/DAL handle role verification
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
