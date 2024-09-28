import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma"; // Adjust the path as necessary

export async function GET(_req: NextRequest) {
  return NextResponse.json(
    await prisma.role.findMany({ select: { roleId: true, roleName: true } }),
    { status: 200 }
  );
}
