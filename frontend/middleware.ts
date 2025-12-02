import { NextResponse } from 'next/server';

export const config = {
  matcher: [
    // Match all routes except API, static files, and images
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};

/**
 * Middleware note:
 * Token is stored in localStorage which is client-side only.
 * Server-side middleware cannot access localStorage.
 * Authentication check for protected routes (like /checkout)
 * is handled on the client-side using useAuthHydration hook.
 *
 * This middleware just ensures routing works properly.
 */
export function middleware(request: any) {
  // All routing is allowed - client-side will handle auth redirects
  return NextResponse.next();
}


