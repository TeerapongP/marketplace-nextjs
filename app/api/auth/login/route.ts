import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../../lib/prisma';

// Ensure JWT_SECRET is defined
const JWT_SECRET = process.env.JWT_SECRET || "";
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not defined');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password, roleId } = body;

    if (!username || !password || !roleId) {
      return NextResponse.json({ message: 'Username, password, and role are required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { userName: username,roleId },
      select: {
        userId: true,
        userName: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        address: true,
        userImage: true,
        password: true, // Include password to verify it
        roleId: true // Include roleId
      }
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Compare provided password with stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Check if provided role matches user's role
    if (roleId !== user.roleId) {
      return NextResponse.json({ message: 'Invalid role' }, { status: 403 });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.userId, username: user.userName, roleId: user.roleId },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return NextResponse.json({ message: 'Login successful', token, userId: user.userId, userName: username }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
 