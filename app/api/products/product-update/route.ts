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
      productId: string;
      productName: string;
      description: string;
      price: number;
      stock: number;
      images: File;
      shopId: number;
      categoryId:number
    };
    
    // Early return if any of the required fields are missing
    if (!body.productId || !body.productName || !body.description || !body.price || !body.images) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }


    // Destructure and parse shopId as integer
    const { shopId, productId, productName, description, price, stock, categoryId, images } = body;
    const parsedProductId = parseInt(productId, 10); // Parse as integer

    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    const userId = decoded.userId;

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
    // Update the shop in the database
    const shop = await prisma.product.update({
      where: { productId: parsedProductId }, // Use parsedShopId here
      data: {
        productName,
        description,
        images: uniqueFileName,
        price: Number(price),
        shopId: Number(shopId),
        categoryId: Number(categoryId),
        stock: Number(stock),
      },
    });

    return NextResponse.json({
      success: true,
      shop,
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
