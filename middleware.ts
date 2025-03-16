import { NextRequest, NextResponse } from "next/server";
import { USER_ROLES } from "@/lib/constants";
import { auth } from "./auth";

// Since auth() can only be used in server components, we need a different approach for middleware
// We'll use the NextAuth middleware approach
export default auth((request) => {
  const { nextUrl } = request;
  const { auth } = request;
  
  const isLoggedIn = !!auth?.user;
  const isAdmin = auth?.user?.role === USER_ROLES.ADMIN;

  const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
  const isOnAuth = nextUrl.pathname.startsWith("/auth");
  const isOnProfile = nextUrl.pathname.startsWith("/profile");

  console.log(
    `Middleware: ${nextUrl.pathname}, isLoggedIn: ${isLoggedIn}, isAdmin: ${isAdmin}`
  );

  // Protect dashboard routes - only admins can access
  if (isOnDashboard) {
    if (!isLoggedIn) {
      console.log("User not logged in, redirecting to /auth/signin");
      return Response.redirect(new URL("/auth/signin", nextUrl));
    }

    if (!isAdmin) {
      console.log("User is not an admin, redirecting to home page");
      return Response.redirect(new URL("/not-found", nextUrl));
    }

    return NextResponse.next();
  }

  // Redirect admin users to dashboard when trying to access profile
  if (isLoggedIn && isAdmin && isOnProfile) {
    console.log("Admin user trying to access profile, redirecting to /dashboard");
    return Response.redirect(new URL("/dashboard", nextUrl));
  }

  // Redirect logged-in admin users away from auth pages to dashboard
  if (isLoggedIn && isAdmin && isOnAuth) {
    console.log("Admin user trying to access auth pages, redirecting to /dashboard");
    return Response.redirect(new URL("/dashboard", nextUrl));
  }

  // Redirect logged-in non-admin users away from auth pages to profile
  if (isLoggedIn && !isAdmin && isOnAuth) {
    console.log("Non-admin user trying to access auth pages, redirecting to /profile");
    return Response.redirect(new URL("/profile", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/auth/:path*",
  ],
};
