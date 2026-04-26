import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
    // 🔹 Backend sets 'accessToken' and 'refreshToken'
    const accessToken = req.cookies.get("accessToken")?.value;
    const refreshToken = req.cookies.get("refreshToken")?.value;

    const { pathname } = req.nextUrl;

    const isRoot = pathname === "/";
    const isDashboard = pathname.startsWith("/dashboard");

    // 🔹 check user logged in hai ya nahi
    const isAuthenticated = !!accessToken || !!refreshToken;

    // 1. If not authenticated and trying to access any non-root route → login
    if (!isAuthenticated && !isRoot) {
        const loginUrl = new URL("/", req.url);
        loginUrl.searchParams.set("mode", "login");
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // 2. If not authenticated but on root → let MainLayoutClient decide (Auth or Home)
    // 3. Dashboard route: unauthenticated users already redirected above.
    //    Role verification (ADMIN only) is handled client-side in AdminDashboardLayout
    //    because role info is not available in the cookie payload at middleware level.

    return NextResponse.next();
}

// 🔹 Middleware matcher
export const config = {
    matcher: ["/((?!_next|favicon.ico|api|images).*)"],
};