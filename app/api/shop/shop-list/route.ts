import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma"; // Adjust the path as necessary

export async function GET(req: NextRequest) {
  try {
    // Fetch the list of shops with the desired fields
    const shops = await prisma.shop.findMany({
      select: {
        shopId: true,
        shopName: true,
        shopDescription: true,
        shopImages: true,
        status: true,
      },
    });

    // Return the list of shops
    return NextResponse.json(shops, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
