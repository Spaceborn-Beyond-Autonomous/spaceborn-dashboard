import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Define role-based route access
const roleRoutes = {
  admin: ['/admin', '/dashboard', '/settings'],
  core: ['/dashboard', '/projects', '/teams'],
  employee: ['/dashboard', '/tasks'],
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('accessToken')?.value;

  // Public routes
  if (pathname === '/login' || pathname === '/signup') {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Protected routes - require auth
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Decode JWT to get role (lightweight check)
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const userRole = payload.role as string;

    // Check role-based access
    if (pathname.startsWith('/admin') && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    if (pathname.startsWith('/teams') && !['admin', 'core'].includes(userRole)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

  } catch (error) {
    // Invalid token
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
