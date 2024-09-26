import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma"; // Adjust the path as necessary

export async function GET(req: NextRequest) {
  try {
    const roles = await prisma.role.findMany({
      select: {
        roleId: true,
        roleName: true,
      },
    });

    // Return the list of roles
    return NextResponse.json(roles, { status: 200 });
  } catch (error) {
    error;
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
