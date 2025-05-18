'use server';

import db from '@/src/db/index';
import { eq } from 'drizzle-orm';
import { freelancers } from '@/src/db/schema';

export async function checkFreelancerStatus(email: string) {
	try {
		const freelancer = await db.query.freelancers.findFirst({
			where: eq(freelancers.email, email),
		});

		return !!freelancer;
	} catch (error) {
		console.error('Error checking freelancer status:', error);
		return false;
	}
}
