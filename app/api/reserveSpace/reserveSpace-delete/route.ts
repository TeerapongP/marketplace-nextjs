import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "../../../../lib/prisma"; // Adjust the path as necessary
import { space } from "postcss/lib/list";

// Ensure JWT_SECRET is always a string
const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not defined");
}

export async function DELETE(req: NextRequest) {
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
    // Extract the reserveSpaceId from the request body
    const { reserveSpaceId, spaceId } = await req.json();
    if (!reserveSpaceId) {
      return NextResponse.json(
        { message: "reserveSpaceId is required" },
        { status: 400 }
      );
    }

    const space = await prisma.space.update({
      where: {
        spaceId: Number(spaceId),
      },
      data: {
        status: Boolean(false),
      },
    });

    // Query to delete the reserve space
    const deletedSpace = await prisma.reserveSpace.delete({
      where: {
        reserveSpaceId: Number(reserveSpaceId),
      },
    });
    // Return the deleted data
    return NextResponse.json(deletedSpace, { status: 200 });

  } catch (error) {
    console.error("Error deleting reserveSpace:", error);
    return NextResponse.json(
      { message: "Error deleting reserveSpace" },
      { status: 500 }
    );
  }
}
