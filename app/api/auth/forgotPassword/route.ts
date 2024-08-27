import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { userName, newPassword } = await req.json();

    if (!userName || !newPassword || typeof userName !== 'string' || typeof newPassword !== 'string') {
      return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { userName },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { userName },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
