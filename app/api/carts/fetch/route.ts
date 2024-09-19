import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma"; // Adjust the path as necessary
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
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

    // Extract user ID from the request URL
    const { searchParams } = new URL(req.url);
    const userIdParam = searchParams.get("id");
    const userId = userIdParam ? Number(userIdParam) : decoded.userId;

    if (isNaN(userId)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    // Fetch cart items for the user
    const cartItems = await prisma.cart.findMany({
      where: { userId: userId },
      include: {
        product: true, // Include related product data
      },
    });

    // Format the response to include only the desired fields
    const formattedCartItems = cartItems.map((item) => ({
      quantity: item.quantity,
      productName: item.product.productName,
      price: item.product.price,
      stock: item.product.stock,
      images: item.product.images,
    }));

    return NextResponse.json(formattedCartItems);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error fetching cart items" },
      { status: 500 }
    );
  }
}
