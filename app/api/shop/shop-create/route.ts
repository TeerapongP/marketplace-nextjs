import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { prisma } from "@/lib/prisma"; // Adjust the path as necessary
import jwt from "jsonwebtoken"; // Ensure this package is installed
import DecodedToken from "../../interface/decodedToken";

const UPLOAD_DIR = path.resolve(process.env.ROOT_PATH ?? "", "public/uploads");
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB limit
const REQUIRED_FILE_EXTENSIONS = ["jpg", "jpeg", "png"];

export const POST = async (req: NextRequest) => {
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
      shopName: string;
      shopDescription: string;
      status: string;
      shopImages: Blob;
    };
  
    const shopName = body.shopName;
    const shopDescription = body.shopDescription;
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    const userId = decoded.userId;

    const parseBoolean = (value: string): boolean => {
      return value.toLowerCase() === 'true';
    };
  
    const status = parseBoolean(body.status);
    const file = (body.shopImages as Blob) || null;
  
    if (!file) {
      return NextResponse.json({ success: false, message: "No file uploaded" });
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE || REQUIRED_FILE_EXTENSIONS.includes(file.type.split("/")[1]) === false) {
      return NextResponse.json({ success: false, message: "File size exceeds the limit" }, { status: 400 });
    }
  
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }
  
    const uniqueFileName = `${Date.now()}-${(body.shopImages as File).name}`;
    const filePath = path.resolve(UPLOAD_DIR, uniqueFileName);
  
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);
  
    const shop = await prisma.shop.create({
      data: {
        shopName,
        shopDescription,
        shopImages: uniqueFileName,
        status,
        ownerId: userId,
      },
    });
  
    return NextResponse.json({
      success: true,
      shop,
      fileName: uniqueFileName,
    });
  } catch (err) {
    console.error("Error uploading file or creating shop:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
};
