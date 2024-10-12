import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "../../../../lib/prisma"; // Adjust the path as necessary

// Ensure JWT_SECRET is always a string
const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not defined");
}

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

    // Verify the token
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 403 }
      );
    }

    // Query to fetch all spaces
    const spaces = await prisma.space.findMany({
      select: {
        spaceId: true,
        spaceLocation: true,
        pricePerDay: true,
        images: true, // Ensure 'images' exists in the schema and the Prisma Client is regenerated
      },
    });

    // Return the fetched data
    return NextResponse.json(spaces, { status: 200 });

  } catch (error) {
    console.error("Error fetching spaces:", error);
    return NextResponse.json(
      { message: "Error fetching spaces" },
      { status: 500 }
    );
  }
}
