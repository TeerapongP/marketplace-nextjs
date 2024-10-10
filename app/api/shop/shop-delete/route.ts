import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma"; // Adjust the path as necessary

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

    // Delete the shop and related products in a single transaction
    await prisma.$transaction([
      prisma.product.deleteMany({ where: { shopId } }),
      prisma.shop.delete({ where: { shopId } }),
    ]);

    return NextResponse.json({ message: "Shop and related products deleted successfully" });
  } catch (error) {
    console.log("Error removing from shop:", error);
    return NextResponse.json(
      { error: "Error removing shop or products" },
      { status: 500 }
    );
  }
}
