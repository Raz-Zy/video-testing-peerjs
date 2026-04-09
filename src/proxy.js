import { NextResponse } from "next/server";

export function proxy(request) {
    const sessionToken =
      request.cookies.get("__Secure-authjs.session-token")?.value ||
      request.cookies.get("authjs.session-token")?.value;

    if (!sessionToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/products/:path*", "/manage-products/:path*", "/orders/:path*", "/cart/:path*", "/meeting/:path*"]
}