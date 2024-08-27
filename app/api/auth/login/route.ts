import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prisma } from "../../../../lib/prisma";

// Ensure JWT_SECRET is always a string
const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not defined");
}

export async function POST(req: NextRequest) {
  try {
    const body: { username: string; roleId: number; password: string } = await req.json();
    const { username, roleId, password } = body;

    if (!username || roleId === undefined || !password) {
      return NextResponse.json(
        { message: "Username, roleId, and password are required" },
        { status: 400 }
      );
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
        password: true, // Include password hash
        roleId: true, // Include roleId
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ message: "Invalid password" }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.userId, username: user.userName, roleId: user.roleId },
      JWT_SECRET, // JWT_SECRET is guaranteed to be a string here
      { expiresIn: "1h" }
    );

    // Return user data along with the token
    return NextResponse.json(
      {
        message: "User found",
        user: {
          userId: user.userId,
          userName: user.userName,
          roleId: user.roleId,
        },
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
