import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma"; // Adjust the path as necessary
import jwt from "jsonwebtoken";

export async function DELETE(req: NextRequest) {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    return NextResponse.json(
      { message: "JWT_SECRET environment variable is not defined" },
      { status: 500 }
    );
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json(
      { message: "Authorization header is missing" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return NextResponse.json({ message: "Token is missing" }, { status: 401 });
  }

  try {
    const { shopId } = await req.json();
    if (typeof shopId !== "number" || isNaN(shopId)) {
      return NextResponse.json({ message: "Invalid shop ID" }, { status: 400 });
    }

    await prisma.shop.delete({ where: { shopId } });
    return NextResponse.json({ message: "Item removed from shop" });
  } catch (error) {
    console.log("Error removing from shop:", error);
    return NextResponse.json(
      { error: "Error removing from shop" },
      { status: 500 }
    );
  }
}
