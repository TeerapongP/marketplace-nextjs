import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma"; // Adjust the path as necessary

export async function GET(req: NextRequest) {
  try {
    // Extract the shopId from the query parameters
    const { searchParams } = new URL(req.url);
    const shopId = Number(searchParams.get('shopId'));

    // Fetch products for the specified shopId
    const products = await prisma.product.findMany({
      where: {
        shopId: shopId > 0 ? shopId : undefined,
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
    console.error(error); // Log the error for debugging
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
