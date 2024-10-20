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

    // Fetch reserve spaces
    const spaces = await prisma.reserveSpace.findMany({
      select: {
        reserveSpaceId: true,
        reserveDate: true,
        status: true,
        roleId: true,
        spaceId: true,
        userId: true,
        space: { // Include space data
          select: {
            spaceId: true,
            spaceLocation: true, // Include necessary fields
          },
        },
      },
    });

    // Fetch user data for each space entry
    const userIds = spaces.map(space => space.userId);
    const users = await prisma.user.findMany({
      where: {
        userId: {
          in: userIds,
        },
      },
      select: {
        userId: true,  // Keep userId if needed for internal logic
        userName: true, // Include userName
      },
    });

    // Combine the spaces with their corresponding users and shops
    const spacesWithUsers = spaces.map(space => {
      const user = users.find(user => user.userId === space.userId);

      return {
        ...space,
        user: user ? { userName: user.userName } : null, // Include userName only
      };
    });

    // Return the fetched data
    return NextResponse.json(spacesWithUsers, { status: 200 });

  } catch (error) {
    console.error("Error fetching reserveSpace:", error);
    return NextResponse.json(
      { message: "Error fetching reserveSpace" },
      { status: 500 }
    );
  }
}
