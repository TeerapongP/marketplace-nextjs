import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma"; // Adjust the path as necessary

/**
 * Handles the HTTP DELETE request to remove a product.
 *
 * @param {NextRequest} req - The incoming HTTP request.
 * @return {NextResponse} The HTTP response with the result of the deletion.
 */
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
    const { productId } = await req.json();
    if (typeof productId !== "number" || isNaN(productId)) {
      return NextResponse.json(
        { message: "Invalid product ID" },
        { status: 400 }
      );
    }

    await prisma.product.delete({ where: { productId } });
    return NextResponse.json({ message: "Item removed from product" });
  } catch (error: any) {
    if (error.code === "P2003") {
      return NextResponse.json(
        {
          message:
            "Cannot delete product because it is referenced in existing orders.",
        },
        { status: 400 } // Use 400 for client error
      );
    }
    return NextResponse.json(
      { error: "Error removing from product" },
      { status: 500 }
    );
  }
}
