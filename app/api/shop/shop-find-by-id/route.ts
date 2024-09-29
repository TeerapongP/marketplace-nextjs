import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "../../../../lib/prisma"; // Adjust the path as necessary

const JWT_SECRET = process.env.JWT_SECRET || "";

export async function GET(req: NextRequest) {
  try {
    // Extract the Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.log("Authorization header is missing");
      return NextResponse.json(
        { message: "Authorization header is missing" },
        { status: 401 }
      );
    }

    console.log("Authorization Header:", authHeader);

    // Extract the token from the Authorization header
    const token = authHeader.split(" ")[1]; // Assumes 'Bearer <token>'
    if (!token) {
      console.log("Token is missing");
      return NextResponse.json(
        { message: "Token is missing" },
        { status: 401 }
      );
    }

    console.log("Extracted Token:", token);

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    if (!decoded || !decoded.userId) {
      console.log("Invalid token");
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    console.log("Decoded Token:", decoded);

    // Extract the shopId from the request's query parameters
    const { searchParams } = new URL(req.url);
    const shopId = parseInt(searchParams.get("shopId") || "", 10);

    if (isNaN(shopId)) {
      console.log("Invalid shopId:", searchParams.get("shopId"));
      return NextResponse.json(
        { message: "Invalid shopId" },
        { status: 400 }
      );
    }

    console.log("shopId:", shopId);

    // Query the shop based on the shopId
    const updatedShop = await prisma.shop.findUnique({
      where: { shopId: shopId }, // Adjust field name based on your schema
    });

    if (!updatedShop) {
      console.log("Shop not found for shopId:", shopId);
      return NextResponse.json(
        { message: "Shop not found" },
        { status: 404 }
      );
    }

    // Return the updated shop data
    return NextResponse.json(updatedShop, { status: 200 });
  } catch (error) {
    console.error("Error during request processing:", error);

    // Check for JWT-related errors
    if (error instanceof jwt.JsonWebTokenError) {
      console.log("JWT Error:", error.message);
      return NextResponse.json(
        { message: "JWT Error: " + error.message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
