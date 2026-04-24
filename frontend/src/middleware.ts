import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_ROUTES = ['/owner', '/admin', '/simpan', '/akun'];
const AUTH_ROUTES = ['/login', '/daftar'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('manokos_token')?.value;
  // Note: since we use localStorage (not cookies), server-side protection is limited.
  // This middleware handles the URL-level redirects for basic protection.
  // Full auth guard relies on the client-side AuthContext.
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
