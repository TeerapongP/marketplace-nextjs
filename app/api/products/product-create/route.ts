import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { prisma } from "@/lib/prisma"; // Adjust the path as necessary
import jwt from "jsonwebtoken"; // Ensure this package is installed
import DecodedToken from "../../interface/decodedToken";

const UPLOAD_DIR = path.resolve(process.env.ROOT_PATH ?? "", "public/uploads");
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB limit
const REQUIRED_FILE_EXTENSIONS = ["jpg", "jpeg", "png"];

export const PATCH = async (req: NextRequest) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    return NextResponse.json(
      { message: "JWT_SECRET environment variable is not defined" },
      { status: 500 }
    );
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json(
      { message: "Authorization header is missing" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return NextResponse.json({ message: "Token is missing" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const body = Object.fromEntries(formData) as unknown as {
      productName: string;
      description: string;
      price: number;
      stock: number;
      images: File;
      shopId: number;
      categoryId: number;
    };

    // Early return if any of the required fields are missing
    if (!body.productName || !body.description || !body.price || !body.images) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // Destructure and parse fields
    const { shopId, productName, description, price, stock, categoryId, images } = body;

    // Validate uploaded file
    if (images.size > MAX_FILE_SIZE || !REQUIRED_FILE_EXTENSIONS.includes(images.type.split("/")[1])) {
      return NextResponse.json({ success: false, message: "File size exceeds the limit" }, { status: 400 });
    }

    // Ensure upload directory exists
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    const uniqueFileName = `${Date.now()}-${images.name}`;
    const filePath = path.resolve(UPLOAD_DIR, uniqueFileName);

    // Convert Blob/File to buffer and write to file
    const buffer = Buffer.from(await images.arrayBuffer());
    const uint8Array = new Uint8Array(buffer); // Convert Buffer to Uint8Array
    await fs.promises.writeFile(filePath, uint8Array);

    // Validate and parse numeric fields
    const numericPrice = Number(price);
    const numericStock = Number(stock);
    const numericShopId = Number(shopId);
    const numericCategoryId = Number(categoryId);

    // Check for valid input values
    if (!productName || !description || isNaN(numericPrice) || isNaN(numericStock) || !images) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    if (numericPrice <= 0 || numericStock < 0 || numericShopId <= 0 || numericCategoryId <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid input values" },
        { status: 400 }
      );
    }

    // Log product data before creating
    console.log("Product data:", {
      productName,
      description,
      price: numericPrice,
      stock: numericStock,
      shopId: numericShopId,
      categoryId: numericCategoryId,
      fileName: uniqueFileName,
    });

    // Update the product in the database
    const product = await prisma.product.create({
      data: {
        productName,
        description,
        images: uniqueFileName,
        price: numericPrice,
        shopId: numericShopId,
        categoryId: numericCategoryId,
        stock: numericStock,
      },
    });

    return NextResponse.json({
      success: true,
      product,
      fileName: uniqueFileName,
    });
  } catch (err) {
    console.error("Error uploading file or creating product:", err);
    if (err instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
};
