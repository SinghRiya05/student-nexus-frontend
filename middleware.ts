import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    // 🔹 Backend sets 'accessToken' and 'refreshToken'
    const accessToken = req.cookies.get("accessToken")?.value;
    const refreshToken = req.cookies.get("refreshToken")?.value;

    const { pathname, searchParams } = req.nextUrl;

    // root path is our gateway
    const isRoot = pathname === "/";

    // 🔹 check user logged in hai ya nahi
    const isAuthenticated = !!accessToken || !!refreshToken;

    // ❌ AUTH PROTECTION LOGIC

    // 1. If trying to access a PROTECTED path (not root) and not authenticated
    if (!isAuthenticated && !isRoot) {
        const loginUrl = new URL("/", req.url);
        loginUrl.searchParams.set("mode", "login");
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // 2. We always allow the Root path (/) 
    // The MainLayoutClient will decide whether to show Dashboard or Login/Signup based on Redux state
    // This avoids "redirect loops" if Redux and Cookies are temporarily out of sync.

    return NextResponse.next();
}

// 🔹 Middleware matcher
export const config = {
    matcher: ["/((?!_next|favicon.ico|api|images).*)"],
};