import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma"; // Adjust the path as necessary
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {

  try {
    // Extract the Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json(
        { message: "Authorization header is missing" },
        { status: 401 }
      );
    }

    // Extract the token from the Authorization header
    const token = authHeader.split(" ")[1]; // Assumes 'Bearer <token>'
    if (!token) {
      return NextResponse.json(
        { message: "Token is missing" },
        { status: 401 }
      );
    }

    const space = await prisma.space.findMany();
    return NextResponse.json(space);
  } catch (error) {
    console.log("Error fetching cart items:", error);
    return NextResponse.json(
      { error: "Error fetching cart items" },
      { status: 500 }
    );
  }
}
