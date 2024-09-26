import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma"; // Adjust the path as necessary
import jwt from "jsonwebtoken";

export async function DELETE(req: NextRequest) {
  const JWT_SECRET = process.env.JWT_SECRET || "";
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

    // Verify the token and extract user ID
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // Parse the request body to get cartId
    const requestBody = await req.json();
    const cartsId = requestBody.cartId;

    if (typeof cartsId !== "number" || isNaN(cartsId)) {
      return NextResponse.json({ message: "Invalid cart ID" }, { status: 400 });
    }

    // Delete the cart item
    await prisma.cart.delete({
      where: { cartId: cartsId },
    });

    return NextResponse.json({ message: "Item removed from cart" });
  } catch (error) {
    error;
    return NextResponse.json(
      { error: "Error removing from cart" },
      { status: 500 }
    );
  }
}
