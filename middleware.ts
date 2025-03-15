import NextAuth from "next-auth"; // { type Session }
import { authConfig } from "@/auth.config";
import { USER_ROLES } from "@/lib/constants";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl, auth } = req;

  // Debugging logs
  console.log("Auth object:", auth);
  console.log("User:", auth?.user);

  const isLoggedIn = !!auth?.user;
  const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
  const isAdmin = auth?.user?.role === USER_ROLES.ADMIN;
  const isOnAuth = nextUrl.pathname.startsWith("/auth");
  const isOnProfile = nextUrl.pathname.startsWith("/profile");

  console.log(
    `Accessing: ${nextUrl.pathname}, isLoggedIn: ${isLoggedIn}, isAdmin: ${isAdmin}`
  );

  // Protect dashboard routes - only admins can access
  if (isOnDashboard) {
    if (!isLoggedIn) {
      console.log("User not logged in, redirecting to /auth/signin");
      return NextResponse.redirect(new URL("/auth/signin", nextUrl));
    }

    if (!isAdmin) {
      console.log("User is not an admin, redirecting to home page");
      return NextResponse.redirect(new URL("/", nextUrl));
    }

    return NextResponse.next();
  }

  // Redirect admin users to dashboard when trying to access profile
  if (isLoggedIn && isAdmin && isOnProfile) {
    console.log("Admin user trying to access profile, redirecting to /dashboard");
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // Redirect logged-in admin users away from auth pages to dashboard
  if (isLoggedIn && isAdmin && isOnAuth) {
    console.log("Admin user trying to access auth pages, redirecting to /dashboard");
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // Redirect logged-in non-admin users away from auth pages to profile
  if (isLoggedIn && !isAdmin && isOnAuth) {
    console.log("Non-admin user trying to access auth pages, redirecting to /profile");
    return NextResponse.redirect(new URL("/profile", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/auth/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
