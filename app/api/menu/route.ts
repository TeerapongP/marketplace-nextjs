import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma"; // Adjust the path as necessary

export async function GET(req: NextRequest) {
  try {
    const roles = await prisma.menu.findMany({
      select: {
        menuName: true,
        menuUrl: true,
        roles: true,
      },
    });

    // Return the list of roles
    return NextResponse.json(roles, { status: 200 });
  } catch (error) {
    console.log("ERROR : ",error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
