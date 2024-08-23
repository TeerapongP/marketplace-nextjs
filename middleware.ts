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
