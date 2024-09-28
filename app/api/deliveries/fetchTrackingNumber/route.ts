// pages/api/deliveries.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma"; // Adjust the path as necessary
import jwt from "jsonwebtoken";

const handleError = (message: string, status: number) => {
  return NextResponse.json({ message }, { status });
};

export async function GET(req: NextRequest) {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    return handleError("JWT secret is not defined", 500);
  }

  try {
    // Extract the Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return handleError("Authorization header is missing", 401);
    }

    // Extract the token from the Authorization header
    const token = authHeader.split(" ")[1]; // Assumes 'Bearer <token>'
    if (!token) {
      return handleError("Token is missing", 401);
    }

    // Verify the JWT token
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return handleError("Invalid token", 403);
    }

    // Extract trackingNumber and userId from query parameters
    const trackingNumber = req.nextUrl.searchParams.get('trackingNumber');
    const userId = req.nextUrl.searchParams.get('userId');

    if (!trackingNumber) {
      return handleError("Tracking number is missing", 400);
    }

    if (!userId) {
      return handleError("User ID is missing", 400);
    }

    // Fetch shipments associated with the tracking number and filter by user ID
    const shipments = await prisma.shipment.findMany({
      where: {
        trackingNumber: trackingNumber,
        order: {
          userId: Number(userId), // This filters the order by user ID
        },
      },
      select: {
        shipmentId: true,
        shipmentDate: true,
        name: true,
        lastName: true,
        address: true,
        city: true,
        state: true,
        country: true,
        zipCode: true,
        trackingNumber: true,
        orderId: true, // Keep orderId but exclude full order details
      },
    });

    if (!shipments.length) {
      return handleError("No shipments found for this tracking number", 404);
    }

    return NextResponse.json(shipments, { status: 200 });
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    return handleError("Error fetching shipments", 500);
  }
}
