import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Use constants for public paths and API paths
const ALLOWED_PATHS = [
  "/",
  "/pages/auth/login",
  "/pages/auth/register",
  "/pages/profile",
  "/pages/auth/forgotpassword",
  "/pages/products/",
];

const ALLOWED_API_PATHS = [
  "/api/menu",
  "/api/role",
  "/api/auth/login",
  "/api/auth/register",
  "/api/shop/shop-list",
  "/api/auth/forgotPassword",
  "/api/shop/shop-find-by-name",
  "/api/products/fetch",
];

// Regex for excluded paths (internal Next.js paths, static assets, etc.)
const EXCLUDED_PATHS_REGEX = [
  /^\/_next\/static\/.*/,
  /^\/_next\/data\/.*/,
  /^\/_next\/image\/.*/,
  /^\/_next\/webpack-hmr/,
  /^\/favicon.ico$/,
  /^\/manifest.json$/,
];

// Helper function to check if a path matches any excluded regex
const isExcludedPath = (pathname: string) =>
  EXCLUDED_PATHS_REGEX.some((regex) => regex.test(pathname));

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Bypass middleware for excluded paths
  if (isExcludedPath(pathname)) {
    return NextResponse.next();
  }

  // Allow access to public paths without authentication
  if (ALLOWED_PATHS.includes(pathname) || ALLOWED_API_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // Authentication required for API requests
  if (pathname.startsWith("/api/")) {
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { message: "No token provided" },
        { status: 401 }
      );
    }

    try {
      const token = authHeader.split(" ")[1];
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET!)
      );

      // Attach user info to request headers if needed
      req.headers.set("user", JSON.stringify(payload));
      return NextResponse.next();
    } catch (error) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
  }

  // Redirect to a 404 page for other non-matching paths
  return NextResponse.rewrite(new URL("/404", req.url));
}

// Apply middleware to specific routes
export const config = {
  matcher: ["/", "/api/:path*", "/(.*)"],
};
