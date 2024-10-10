import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"; // Import bcrypt for password comparison
import { prisma } from "../../../../lib/prisma";

// Ensure JWT_SECRET is always a string
const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not defined");
}

export async function POST(req: NextRequest) {
  try {
    const body: { username: string; password: string } = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required" }, // Updated message
        { status: 400 }
      );
    }

    // Find user by username only
    const user = await prisma.user.findFirst({
      where: { userName: username },
      select: {
        userId: true,
        userName: true,
        password: true, // Get the stored hashed password
        roleId: true, // Include roleId
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Compare the plain-text password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid password" }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: user.userId, username: user.userName, roleId: user.roleId },
      JWT_SECRET,
      { expiresIn: "5h" }
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
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
