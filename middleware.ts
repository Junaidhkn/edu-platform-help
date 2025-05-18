import { NextRequest, NextResponse } from 'next/server';
import { USER_ROLES } from '@/lib/constants';
import { auth } from './auth';

export default auth((req) => {
	const { nextUrl } = req;
	const session = req.auth; // ← now typed!
	const user = session?.user;
	const isLoggedIn = Boolean(user);
	const isAdmin = user?.role === USER_ROLES.ADMIN;

	const { pathname } = nextUrl;
	const onRoot = pathname === '/';
	const onAuth = pathname.startsWith('/auth');
	const onDashboard = pathname.startsWith('/dashboard');
	const onProfile = pathname.startsWith('/profile');

	// 1️⃣ Admins always → /dashboard
	if (isLoggedIn && isAdmin && (onRoot || onAuth || onProfile)) {
		return NextResponse.redirect(new URL('/dashboard', nextUrl));
	}

	// 2️⃣ Non-admin logged-in from root → /profile
	if (isLoggedIn && !isAdmin && onRoot) {
		return NextResponse.redirect(new URL('/profile', nextUrl));
	}

	// 3️⃣ Protect /dashboard
	if (onDashboard) {
		if (!isLoggedIn) {
			return NextResponse.redirect(new URL('/auth/signin', nextUrl));
		}
		if (!isAdmin) {
			return NextResponse.redirect(new URL('/not-found', nextUrl));
		}
		return NextResponse.next();
	}

	// 4️⃣ Block non-admin from /auth
	if (isLoggedIn && !isAdmin && onAuth) {
		return NextResponse.redirect(new URL('/profile', nextUrl));
	}

	// 5️⃣ Everything else
	return NextResponse.next();
});

export const config = {
	matcher: ['/', '/dashboard/:path*', '/profile/:path*', '/auth/:path*'],
};
