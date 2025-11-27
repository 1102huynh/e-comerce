import { NextResponse } from 'next/server';

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};

export function middleware(request: any) {
  const token = request.cookies.get('token')?.value;

  if (!token && request.nextUrl.pathname.startsWith('/checkout')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}
