import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma"; // Adjust the path as necessary

export async function GET(req: NextRequest) {
  try {
    // Fetch products; if categoryId is null, fetch all products
    const products = await prisma.product.findMany({
      select: {
        productId: true,
        productName: true,
        description: true,
        price: true,
        stock: true,
        images: true,
      },
    });

    // Return the list of products
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
