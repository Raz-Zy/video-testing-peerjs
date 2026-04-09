import { NextResponse } from "next/server";

export function proxy(request) {
    const token = request.cookies.get("authjs.session-token");
    // console.log("token", token)
    // console.log("request: ", request)
    // console.log("url: ", request.url)
    if(!token?.value){
        return NextResponse.redirect(new URL("/login", request.url))
    }
}

export const config = {
    matcher: ["/products/:path*", "/manage-products/:path*", "/orders/:path*", "/cart/:path*", "/meeting/:path*"]
}