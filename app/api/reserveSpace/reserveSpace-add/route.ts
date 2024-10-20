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
    const { spaceLocation, pricePerDay, status }: { spaceLocation: string; pricePerDay: number; status: boolean } = body;
    // Create a new reserve space
    const space = await prisma.space.create({
      data: {
        spaceLocation,
        pricePerDay,
        status,
        images: 'https://www.taokaecafe.com/asp-bin/pic_taokae/sl_1294.jpg'
      },
    });

    return NextResponse.json(
      { message: "New Space created successfully", space },
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json(
      { message: `Error: ${error}` },
      { status: 500 }
    );
  }
}
