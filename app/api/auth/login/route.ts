import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, roleId } = body;

    if (!username || !roleId) {
      return NextResponse.json({ message: 'Username and role are required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { userName: username, roleId },
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

    return NextResponse.json({ message: 'User found', userId: user.userId, userName: username }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
