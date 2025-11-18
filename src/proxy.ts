import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { cookies } from "next/headers";
import axiosInstance from "./utils/axiosInstance";
import { adminRoutes, hasPermissionMiddleware, matchRoute } from "./utils/helpers";
import decodedToken from "./utils/decodedToken";

export async function proxy(request: NextRequest) {
  const cookie = await cookies();
  const token = cookie.get("accessToken")?.value;
  const { pathname, search } = request.nextUrl;
  const searchParams = new URLSearchParams(search);
  const responseNext = NextResponse.next();
  const returnUrl = searchParams.get("returnUrl");
  if (!token) {
    if (pathname === "/" || pathname.startsWith("/login")) {
      return responseNext;
    }
    return NextResponse.rewrite(new URL("/login", request.url));
  }

  try {
    const decoded = decodedToken(token);
    const userType = decoded.role;
    const defaultRedirect = userType === "validator" || userType === "admin" ? "/dashboard" : "/home";

    if (pathname === "/login" || pathname === "/") {
      return NextResponse.redirect(new URL(defaultRedirect, request.url));
    }

    const matchedAdmin = matchRoute(returnUrl || pathname, Object.keys(adminRoutes));
    if (!matchedAdmin) {
      return NextResponse.rewrite(new URL("/404", request.url));
    }

    const response = await axiosInstance.get("/auth/user-data", {
      headers: {
        Cookie: cookie.toString(),
      },
    });
    const user = response.data.user;

    if (matchedAdmin) {
      const permissions = user.permissions;
      const allowed = hasPermissionMiddleware([...permissions, "viewPermit", "404"], adminRoutes[matchedAdmin]);
      if (!allowed) {
        return NextResponse.rewrite(new URL("/404", request.url));
      }
    }

    return responseNext;
  } catch {
    cookie.delete("accessToken");
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$|.*\\.jpg$|favicon\\.ico$|sitemap\\.xml$|robots\\.txt$).*)"],
};
