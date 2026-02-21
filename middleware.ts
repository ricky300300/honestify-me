import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token =
    request.cookies.get("token")?.value ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (pathname === "/" || pathname === "/signup" || pathname === "/login") {
    if (!token) return NextResponse.next();
    const secret = process.env.JWT_SECRET;
    if (!secret) return NextResponse.next();
    try {
      await jwtVerify(token, new TextEncoder().encode(secret));
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } catch {
      return NextResponse.next();
    }
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    const email = (payload.email as string) ?? "";

    if (pathname.startsWith("/admin")) {
      const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
      if (!adminEmail || email.toLowerCase() !== adminEmail) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/", "/signup", "/login", "/dashboard", "/dashboard/:path*", "/admin", "/admin/:path*"],
};
