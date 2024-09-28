// pages/api/deliveries.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma"; // Adjust the path as necessary
import jwt from "jsonwebtoken";
import DecodedToken from "../interface/decodedToken";

const handleError = (message: string, status: number) =>
  NextResponse.json({ message }, { status });

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

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    const userId = decoded.userId;

    // Fetch shipments associated with the user's orders in one query
    const shipments = await prisma.shipment.findMany({
      where: { order: { userId } },
      include: { order: { include: { orderItems: { include: { product: true } } } } },
    });


    if (!shipments.length) {
      return handleError("No shipments found for this user", 404);
    }
    // Since `trackingNumber` is in Shipment, it'll be automatically returned with each shipment object.

    return NextResponse.json(shipments, { status: 200 });

  } catch (error) {
    return handleError("Error fetching shipments", 500);
  }
}
