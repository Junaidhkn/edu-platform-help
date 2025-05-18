import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { USER_ROLES } from '@/src/lib/constants';

export async function GET() {
	const session = await auth();

	if (!session || !session.user) {
		return NextResponse.json(
			{ isAdmin: false, message: 'Not authenticated' },
			{ status: 401 },
		);
	}

	const isAdmin = session.user.role === USER_ROLES.ADMIN;

	return NextResponse.json({
		isAdmin,
		message: isAdmin ? 'User is an admin' : 'User is not an admin',
	});
}
