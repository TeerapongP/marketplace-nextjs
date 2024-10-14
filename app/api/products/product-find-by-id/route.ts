import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "../../../../lib/prisma"; // Adjust the path as necessary

const JWT_SECRET = process.env.JWT_SECRET ?? "";

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
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // Extract the productId from the request's query parameters
    const { searchParams } = new URL(req.url);

    const productId = parseInt(searchParams.get("productId") ?? "", 10);
    if (isNaN(productId)) {
      return NextResponse.json(
        { message: "Invalid productId" },
        { status: 400 }
      );
    }

    // Query the product based on the productId
    const updatedProduct = await prisma.product.findUnique({
      where: { productId: productId },
    });

    if (!updatedProduct) {
      return NextResponse.json(
        { message: "product not found" },
        { status: 404 }
      );
    }
    // Return the updated product data
    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error("Error during request processing:", error);

    // Check for JWT-related errors
    if (error instanceof jwt.JsonWebTokenError) {
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
