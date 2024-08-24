import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma'; // Adjust the path as needed

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password, roleId, firstName, lastName, email, phoneNumber, address, userImage } = body;

    if (!username || !password || !roleId) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        userName: username,
      },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'Username already exists' }, { status: 400 });
    }

    // Optionally, you can also check for unique email and phoneNumber
    const existingEmail = email ? await prisma.user.findUnique({ where: { email } }) : null;
    const existingPhoneNumber = phoneNumber ? await prisma.user.findUnique({ where: { phoneNumber } }) : null;

    if (existingEmail) {
      return NextResponse.json({ message: 'Email already exists' }, { status: 400 });
    }

    if (existingPhoneNumber) {
      return NextResponse.json({ message: 'Phone number already exists' }, { status: 400 });
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
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
