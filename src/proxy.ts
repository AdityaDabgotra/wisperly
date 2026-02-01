import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // If user is logged in and tries to access auth pages → dashboard
  if (
    token &&
    (
      pathname === "/" ||
      pathname.startsWith("/signIn") ||
      pathname.startsWith("/signUp") ||
      pathname.startsWith("/verify")
    )
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If user is NOT logged in and tries to access protected pages
  if (
    !token &&
    pathname.startsWith("/dashboard")
  ) {
    return NextResponse.redirect(new URL("/signIn", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/signIn",
    "/signUp",
    "/verify/:path*",
    "/dashboard/:path*",
  ],
};