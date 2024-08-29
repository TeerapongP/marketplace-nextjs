// import { NextRequest, NextResponse } from 'next/server';
// import jwt from 'jsonwebtoken';

// // Define public paths
// const allowedPaths = [
//   '/', 
//   '/auth/login', 
//   '/auth/register', 
//   '/category', 
//   '/shop'
// ];

// // Define API paths that should be allowed without authentication
// const allowedApiPaths = ['/api/menu', '/api/role'];

// // Exclude internal Next.js paths and static assets
// const excludedPaths = [
//   /^\/_next\/static\/.*/,
//   /^\/_next\/data\/.*/,
//   /^\/_next\/image\/.*/,
//   /^\/_next\/webpack-hmr/,
//   /^\/favicon.ico$/,
//   /^\/manifest.json$/,
// ];

// export async function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   // Allow internal Next.js paths and static assets
//   if (excludedPaths.some(pattern => pattern.test(pathname))) {
//     return NextResponse.next();
//   }

//   // Allow specified public paths
//   if (allowedPaths.includes(pathname)) {
//     return NextResponse.next();
//   }

//   // Allow specific API paths without authentication
//   if (allowedApiPaths.some(path => pathname.startsWith(path))) {
//     return NextResponse.next();
//   }

//   // Check if the request path requires authentication
//   if (pathname.startsWith('/api/')) {
//     const authHeader = req.headers.get('authorization');
//     const token = authHeader?.split(' ')[1];

//     if (!token) {
//       return NextResponse.json({ message: 'No token provided' }, { status: 401 });
//     }

//     try {
//       // Verify the JWT token
//       const decoded = jwt.verify(token, process.env.JWT_SECRET!);
//       // Optionally, you can attach user information to the request headers
//       req.headers.set('user', JSON.stringify(decoded));

//       // Allow the request to proceed
//       return NextResponse.next();
//     } catch (error) {
//       return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
//     }
//   }

//   // Redirect to a custom 404 page for other paths
//   return NextResponse.rewrite(new URL('/404', req.url));
// }

// // Define the routes where the middleware should be applied
// export const config = {
//   matcher: [
//     '/', 
//     '/category', 
//     '/shop', 
//     '/auth/login', 
//     '/auth/register', 
//     '/api/:path*', 
//     '/(.*)' // Catch-all for all other routes
//   ],
// };
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export async function middleware(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ message: 'No token provided' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    
    // You can add user information to the headers to use in your API routes.
    req.headers.set('user', JSON.stringify(decoded));

    // Allow the request to proceed
    return NextResponse.next();
  } catch (error) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }
}

// Define the routes where the middleware should be applied
export const config = {
  matcher: ['/api/protected', '/api/another-protected-route'],
};