// app/api/auth/signup.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma'; // Example usage of the alias
// Adjust the path as needed

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password, firstName, lastName, email, phoneNumber, address, roleName  } = body;

    if (!username || !password || !firstName || !lastName || !email || !roleName ) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const role = await prisma.role.findFirst({
      where: {
        roleName: roleName ,
      },
    });

    if (!role) {
      return NextResponse.json({ message: 'Role not found' }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        userName: username,
        password: hashedPassword,
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
        role: {
          connect: { roleId: role.roleId },
        },
      },
    });

    return NextResponse.json({ message: 'User created successfully', user }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
