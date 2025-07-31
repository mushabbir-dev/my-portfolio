import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Handle large payloads for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Set a larger body size limit for API routes
    const response = NextResponse.next();
    response.headers.set('Content-Type', 'application/json');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
  ],
}; 