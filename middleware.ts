import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Define public paths
const allowedPaths = [
  '/',
  '/pages/auth/login',
  '/pages/auth/register',
  '/category',
  '/shop'
];

// Define API paths that should be allowed without authentication
const allowedApiPaths = ['/api/menu', '/api/role', '/api/auth/login', '/api/auth/register'];

// Exclude internal Next.js paths and static assets
const excludedPaths = [
  /^\/_next\/static\/.*/,
  /^\/_next\/data\/.*/,
  /^\/_next\/image\/.*/,
  /^\/_next\/webpack-hmr/,
  /^\/favicon.ico$/,
  /^\/manifest.json$/,
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow internal Next.js paths and static assets
  if (excludedPaths.some(pattern => pattern.test(pathname))) {
    return NextResponse.next();
  }

  // Allow specified public paths
  if (allowedPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Allow specific API paths without authentication
  if (allowedApiPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check if the request path requires authentication
  if (pathname.startsWith('/api/')) {
    const authHeader = req.headers.get('authorization');

    // Extract the token from the "Bearer <token>" format
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }

    try {
      // Verify the JWT token using `jose`
      const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));

      // Optionally, you can attach user information to the request headers
      req.headers.set('user', JSON.stringify(payload));

      return NextResponse.next();
    } catch (error) {
      console.error('Token verification error:', error); // Debugging output
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
  }

  // Redirect to a custom 404 page for other paths
  return NextResponse.rewrite(new URL('/404', req.url));
}

// Define the routes where the middleware should be applied
export const config = {
  matcher: [
    '/',
    '/category',
    '/shop',
    '/api/auth/login',
    '/api/auth/register',
    '/pages/auth/login',
    '/pages/auth/register',
    '/api/:path*',
    '/(.*)' // Catch-all for all other routes
  ],
};
