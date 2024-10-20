import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma"; // Adjust the path as necessary

interface Shop {
  shopId: number; // Adjust according to your actual database schema
  shopName: string;
  // Add other fields as necessary
}

export async function GET(req: NextRequest) {
  try {
    // Extract query parameters from the URL
    const { searchParams } = new URL(req.url);
    const shopName = searchParams.get("shopName");

    if (!shopName) {
      return NextResponse.json(
        { message: "Shop name is required" },
        { status: 400 }
      );
    }

    // Decode URL-encoded shopName
    const decodedShopName = decodeURIComponent(shopName);

    // Perform a case-insensitive search using raw SQL
    const shops = await prisma.$queryRaw<Shop[]>`
      SELECT * FROM "Shop"
      WHERE LOWER("shopName") LIKE LOWER(${`%${decodedShopName}%`})
    `;

    if (shops.length === 0) {
      return NextResponse.json({ message: "No shops found" }, { status: 404 });
    }

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
