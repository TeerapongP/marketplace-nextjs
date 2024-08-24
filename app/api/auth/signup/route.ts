import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password, roleId, firstName, lastName, email, phoneNumber, address, userImage } = body;

    if (!username || !password || !roleId) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        userName: username,
        password: hashedPassword,
        roleId: roleId,
        firstName: firstName || null,
        lastName: lastName || null,
        email: email || null,
        phoneNumber: phoneNumber || null,
        address: address || null,
        userImage: userImage || null,
      },
    });

    return NextResponse.json({ message: 'User created successfully', user }, { status: 201 });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
      const targetField = error.meta?.target;

      return NextResponse.json({
        message: `Unique constraint failed on the field: ${targetField}`,
      }, { status: 400 });
    }
    
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
