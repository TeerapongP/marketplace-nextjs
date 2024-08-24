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
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ message: 'Username and password are required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { userName: username },
      select: { // Specify the fields you want to return
        userId: true,
        userName: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        address: true,
        userImage: true,
        password: true // Include password to verify it
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

    // Generate JWT
    const token = jwt.sign(
      { userId: user.userId, username: user.userName },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    return NextResponse.json({ message: 'Login successful', token, userId:user.userId,userName:username }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
