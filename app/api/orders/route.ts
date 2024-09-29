import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma"; // Adjust the path as necessary
import jwt from "jsonwebtoken";

// Function to generate a tracking number
const generateTrackingNumber = () => (
  "TH" +
  String(Math.floor(Math.random() * 1e9)).padStart(9, "0") +
  Array.from({ length: 6 }, () => String.fromCharCode(65 + Math.floor(26 * Math.random()))).join("")
);

export async function POST(req: NextRequest) {
  const JWT_SECRET = process.env.JWT_SECRET || "";

  try {
    // Extract the Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json(
        { message: "Authorization header is missing" },
        { status: 401 }
      );
    }

    // Extract the token from the Authorization header
    const token = authHeader.split(" ")[1]; // Assumes 'Bearer <token>'
    if (!token) {
      return NextResponse.json(
        { message: "Token is missing" },
        { status: 401 }
      );
    }

    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
      if (!decoded) {
        return NextResponse.json({ message: "Invalid token" }, { status: 401 });
      }
    } catch (error) {
      return NextResponse.json(
        { message: "JWT malformed or invalid" },
        { status: 401 }
      );
    }

    const { userId } = decoded;
    const { orderItems, totalPrice, shipment } = await req.json();

    // Generate a tracking number
    const trackingNumber = generateTrackingNumber();

    // Create the order in the database
    const newOrder = await prisma.order.create({
      data: {
        userId,
        totalPrice,
        orderItems: {
          create: orderItems.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            totalPrice: item.totalPrice,
          })),
        },
        shipments: {
          create: {
            name: shipment.name,
            lastName: shipment.lastName,
            address: shipment.address,
            city: shipment.city,
            state: shipment.state,
            country: shipment.country,
            zipCode: shipment.zipCode,
            trackingNumber: trackingNumber as unknown as string, // Type assertion
          } as any,
        },
      },
    });

    // Clear the user's cart after the order is placed
    await prisma.cart.deleteMany({
      where: {
        userId: userId,
      },
    });

    return NextResponse.json(
      { message: "Order placed successfully", newOrder },
      { status: 201 }
    );
  } catch (error) {
    console.log("ERROR : ",error);
    return NextResponse.json({ error: "Error placing order" }, { status: 500 });
  }
}
