import { NextResponse } from "next/server";

// Keep your prefix-matching routes here
const protectedPrefixes = ["/submit", "/create-community"];
const authRoutes         = ["/login", "/signup"];

export function middleware(request) {
  const token    = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Check if it's the exact root OR starts with one of your protected prefixes
  const isProtected = pathname === "/" || protectedPrefixes.some((r) => pathname.startsWith(r));
  const isAuthPage  = authRoutes.some((r) => pathname.startsWith(r));

  if (isProtected && !token) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};