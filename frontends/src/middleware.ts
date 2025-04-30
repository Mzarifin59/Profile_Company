import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  
  // Check if the path starts with /admin
  const isAdminPath = path.startsWith('/admin');
  
  // Check if user is authenticated by looking for the adminToken cookie
  const adminToken = request.cookies.get('adminToken')?.value || '';
  const isAuthenticated = !!adminToken;
  
  // If trying to access admin route but not authenticated
  if (isAdminPath && !isAuthenticated) {
    // Redirect to login page
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // If already authenticated and trying to access login
  if (path === '/login' && isAuthenticated) {
    // Redirect to admin dashboard
    return NextResponse.redirect(new URL('/admin', request.url));
  }
  
  return NextResponse.next();
}

// Configure middleware to run only on specific paths
export const config = {
  matcher: ['/admin/:path*', '/login'],
};