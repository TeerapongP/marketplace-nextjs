import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "../../../../lib/prisma"; // Adjust the path as necessary

const JWT_SECRET = process.env.JWT_SECRET || "";

export async function PUT(req: NextRequest) {
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
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // Parse the request body
    const { shopId, status }: { shopId: number; status: boolean } =
      await req.json();

    // Ensure the shopId and status are provided and valid
    if (typeof shopId !== "number" || typeof status !== "boolean") {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    // Update the shop status in the database
    const updatedShop = await prisma.shop.update({
      where: { shopId: shopId }, // Use the correct field name for your primary key
      data: { status },
    });

    // Return the updated shop
    return NextResponse.json(updatedShop, { status: 200 });
  } catch (error) {
    console.log("Error updating shop status:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
