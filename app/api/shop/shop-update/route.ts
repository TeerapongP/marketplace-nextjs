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
      shopId: string; // Keep this as string initially
      shopName: string;
      shopDescription: string;
      status: string;
      shopImages?: File; // Make shopImages optional
    };

    // Early return if any of the required fields are missing
    if (!body.shopId || !body.shopName || !body.shopDescription || !body.status) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // Destructure and parse shopId as integer
    const { shopId, shopName, shopDescription, status, shopImages } = body;
    const parsedShopId = parseInt(shopId, 10); // Parse as integer

    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    const userId = decoded.userId;

    const parseBoolean = (value: string): boolean => {
      return value.toLowerCase() === 'true';
    };

    const parsedStatus = parseBoolean(status);

    let uniqueFileName: string | undefined;

    // Check if a new image was uploaded
    if (shopImages && undefined !== shopImages.type) {
      // Validate uploaded file
      if (shopImages.size > MAX_FILE_SIZE || !REQUIRED_FILE_EXTENSIONS.includes(shopImages.type.split("/")[1])) {
        return NextResponse.json({ success: false, message: "File size exceeds the limit or invalid file type" }, { status: 400 });
      }

      // Ensure upload directory exists
      if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR, { recursive: true });
      }

      uniqueFileName = `${Date.now()}-${shopImages.name}`;
      const filePath = path.resolve(UPLOAD_DIR, uniqueFileName);

      // Convert Blob/File to buffer and write to file
      const buffer = Buffer.from(await shopImages.arrayBuffer());
      const uint8Array = new Uint8Array(buffer); // Convert Buffer to Uint8Array
      await fs.promises.writeFile(filePath, uint8Array);
    }

    // Prepare the data object for updating the shop
    const updateData: any = {
      shopName,
      shopDescription,
      status: parsedStatus,
      ownerId: userId,
    };

    // If a new image was uploaded, include it in the update
    if (uniqueFileName) {
      updateData.shopImages = uniqueFileName;
    }

    // Update the shop in the database
    const shop = await prisma.shop.update({
      where: { shopId: parsedShopId }, // Use parsedShopId here
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      shop,
      fileName: uniqueFileName,
    });
  } catch (err) {
    console.error("Error uploading file or creating shop:", err);
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
