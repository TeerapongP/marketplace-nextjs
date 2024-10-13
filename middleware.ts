import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Define public paths
enum ALLOW_PATHS {
  Home = "/",
  Login = "/pages/auth/login",
  Register = "/pages/auth/register",
  Profile = "/pages/profile",
  ForgotPassword = "/pages/auth/forgotpassword",
  Products = "/pages/products/",
}

// Define API paths that should be allowed without authentication
enum ALLOW_API_PATHS {
  Menu = "/api/menu",
  Role = "/api/role",
  Login = "/api/auth/login",
  Register = "/api/auth/register",
  ShopList = "/api/shop/shop-list",
  ForgotPassword = "/api/auth/forgotPassword",
  ShopFindByName = "/api/shop/shop-find-by-name",
  ProductsFetch = "/api/products/fetch",
}

// Exclude internal Next.js paths and static assets
const excludedPaths = [
  /^\/_next\/static\/.*/,
  /^\/_next\/data\/.*/,
  /^\/_next\/image\/.*/,
  /^\/_next\/webpack-hmr/,
  /^\/favicon.ico$/,
  /^\/manifest.json$/,
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Quick checks to avoid unnecessary processing
  if (
    excludedPaths.some((pattern) => pattern.test(pathname)) ||
    Object.values(ALLOW_PATHS).some((path) => pathname.startsWith(path)) ||
    Object.values(ALLOW_API_PATHS).some((path) => pathname.startsWith(path))
  ) {
    return NextResponse.next();
  }

  // Check if the request path requires authentication
  if (pathname.startsWith("/api/")) {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!token) {
      return NextResponse.json({ message: "No token provided" }, { status: 401 });
    }

    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET)
      );

      req.headers.set("user", JSON.stringify(payload));

      return NextResponse.next();
    } catch {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
  }

  // Redirect to a custom 404 page for other paths
  return NextResponse.rewrite(new URL("/404", req.url));
}

// Define the routes where the middleware should be applied
export const config = {
  matcher: ["/", "/api/:path*", "/(.*)"],
}
