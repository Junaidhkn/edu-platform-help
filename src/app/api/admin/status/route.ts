import { NextResponse } from 'next/server';
import { ensureAdmin } from '@/src/lib/admin/ensure-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
	try {
		// Check admin status without redirecting
		const { isAuthenticated, isAdmin, user } = await ensureAdmin({
			redirectOnFailure: false,
		});

		return NextResponse.json({
			isAuthenticated,
			isAdmin,
			user: user
				? {
						email: user.email,
						role: user.role,
				  }
				: null,
		});
	} catch (error) {
		console.error('Error checking admin status:', error);
		return NextResponse.json(
			{ error: 'Failed to check admin status' },
			{ status: 500 },
		);
	}
}
