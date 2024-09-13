import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma"; // Adjust the path as necessary

export async function GET(req: NextRequest) {
  try {
    // Extract shopId from the query parameters
    const url = new URL(req.url);
    const shopId = parseInt(url.searchParams.get("shopId") || "0", 10);

    if (isNaN(shopId)) {
      return NextResponse.json(
        { message: "Invalid shopId parameter" },
        { status: 400 }
      );
    }

    // Fetch products associated with the given shopId
    const products = await prisma.product.findMany({
      where: {
        shopId: shopId,
      },
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
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
