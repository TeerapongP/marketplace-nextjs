import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../lib/prisma'; // Adjust the path as necessary

const JWT_SECRET = process.env.JWT_SECRET || '';

export async function GET(req: NextRequest) {
  try {
    // Extract the Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Authorization header is missing' }, { status: 401 });
    }

    // Extract the token from the Authorization header
    const token = authHeader.split(' ')[1]; // Assumes 'Bearer <token>'
    if (!token) {
      return NextResponse.json({ message: 'Token is missing' }, { status: 401 });
    }

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    if (!decoded) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // Extract user ID from the request URL
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    // Fetch user from the database by userId
    const user = await prisma.user.findUnique({
      where: { userId: Number(userId) },
      select: {
        userId: true,
        userName: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        address: true,
        userImage:true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Return user data
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
