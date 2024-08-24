import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../../lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret'; // Use your actual secret

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, roleId } = body;

    if (!username || !roleId) {
      return NextResponse.json({ message: 'Username and role are required' }, { status: 400 });
    }

    // Find user by username and roleId
    const user = await prisma.user.findFirst({
      where: { userName: username, roleId: roleId },
      select: {
        userId: true,
        userName: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        address: true,
        userImage: true,
        roleId: true // Include roleId
      }
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.userId, username: user.userName, roleId: user.roleId },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Return user data along with the token
    return NextResponse.json({
      message: 'User found',
      user: {
        userId: user.userId,
        userName: user.userName,
        roleId: user.roleId
      },
      token
    }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
