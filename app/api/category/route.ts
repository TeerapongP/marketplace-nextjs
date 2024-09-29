import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma"; // Adjust the path as necessary

export async function GET(_req: NextRequest) {
  return NextResponse.json(
    await prisma.category.findMany({ select: { categoryId: true, name: true } }),
    { status: 200 }
  );
}
