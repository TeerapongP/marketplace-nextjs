import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not defined");
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json(
        { message: "Authorization header is missing" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { message: "Token is missing" },
        { status: 401 }
      );
    }

    // Verify the JWT token
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    const userId = payload.userId;

    if (!userId) {
      return NextResponse.json(
        { message: "User ID not found in token" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { status, roleId, spaceId }: { status: boolean; roleId: number; spaceId: number } = body;

    // Validate required fields
    if (typeof status !== "boolean" || !roleId || !spaceId) {
      return NextResponse.json(
        { message: "Missing required fields or invalid status" },
        { status: 400 }
      );
    }


    const spaceExists = await prisma.space.findUnique({
      where: {
        spaceId: Number(
          spaceId)
      },
    });

    if (!spaceExists) {
      return NextResponse.json(
        { message: "The space is Duplicate" },
        { status: 404 }
      );
    }

    // Update the space status
    await prisma.space.update({
      where: { spaceId: Number(spaceId) },
      data: { status },
    });

    // Create a new reserve space
    const reserveSpace = await prisma.reserveSpace.create({
         data: {
        reserveDate: new Date(),
        status,
        roleId: Number(roleId),
        spaceId: Number(spaceId),
        userId: Number(userId),
      },
    });

    return NextResponse.json(
      { message: "Reserve Space created successfully", reserveSpace },
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json(
      { message: `Error: ${error}` },
      { status: 500 }
    );
  }
}
