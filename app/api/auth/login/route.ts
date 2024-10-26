import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"; // Import bcrypt for password comparison
import { prisma } from "../../../../lib/prisma"; // Ensure the correct import path

// Ensure JWT_SECRET is always a string
const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not defined");
}

export async function POST(req: NextRequest) {
  try {
    // Parse the incoming request body
    const body: { email: string; password: string } = await req.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user by username only ค้นหาชื่อผู้ใช้ด้วยชื่อผู้ใช้เท่านั้น
    const user = await prisma.user.findFirst({
      where: { email }, // Find user by email directly
      select: {
        userId: true,
        email: true,
        password: true, // Get the stored hashed password
        roleId: true, // Include roleId
        userName: true,
      },
    });

    // If user not found, return 404
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Compare the plain-text password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If password is invalid, return 401
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid password" }, { status: 401 });
    }

    // Create JWT token with user details
    const token = jwt.sign(
      { userId: user.userId, email: user.email, roleId: user.roleId },
      JWT_SECRET,
      { expiresIn: "5h" } // Token expiration time
    );

    // Return user data along with the token
    return NextResponse.json(
      {
        message: "User found",
        user: {
          userId: user.userId,
          email: user.email,
          roleId: user.roleId,
          userName: user.userName,
        },
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during authentication:", error); // Log the error for debugging
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
