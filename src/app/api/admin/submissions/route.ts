import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import db from '@/src/db';
import { submissions } from '@/src/db/schema';
import { freelancers } from '@/src/db/schema';
import { desc, eq } from 'drizzle-orm';
import { USER_ROLES } from '@/src/lib/constants';
import { sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';
const ITEMS_PER_PAGE = 5;

export async function GET(request: NextRequest) {
	try {
		// 1. Check admin authentication
		const session = await auth();

		if (!session?.user || session.user.role !== USER_ROLES.ADMIN) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const url = new URL(request.url);
		const status = url.searchParams.get('status') || 'pending';
		const page = parseInt(url.searchParams.get('page') || '1');
		const offset = (page - 1) * ITEMS_PER_PAGE;

		const countResult = await db
			.select({ count: sql`count(*)` })
			.from(submissions)
			.where(eq(submissions.status, status));

		const totalCount = Number(countResult[0]?.count || 0);
		const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

		const submissionList = await db
			.select()
			.from(submissions)
			.where(eq(submissions.status, status))
			.orderBy(desc(submissions.createdAt))
			.limit(ITEMS_PER_PAGE)
			.offset(offset);

		const freelancerIds = submissionList.map((sub) => sub.freelancerId);

		let freelancerData: any[] = [];
		if (freelancerIds.length > 0) {
			freelancerData = await db
				.select()
				.from(freelancers)
				.where(eq(freelancers.id, freelancerIds[0]));

			// If there are multiple freelancers, fetch them one by one
			// This is a workaround until we find a better way to handle the 'in' operator
			if (freelancerIds.length > 1) {
				for (let i = 1; i < freelancerIds.length; i++) {
					const additionalFreelancers = await db
						.select()
						.from(freelancers)
						.where(eq(freelancers.id, freelancerIds[i]));

					freelancerData = [...freelancerData, ...additionalFreelancers];
				}
			}
		}

		const submissionsWithRelations = submissionList.map((sub) => {
			// Parse file URLs from JSON string
			const fileUrls = sub.fileUrls ? JSON.parse(sub.fileUrls) : [];

			const freelancerInfo =
				freelancerData.find((f) => f.id === sub.freelancerId) || null;

			return {
				...sub,
				fileUrls,
				freelancer: freelancerInfo,
			};
		});

		return NextResponse.json({
			submissions: submissionsWithRelations,
			total: totalCount,
			totalPages,
			currentPage: page,
		});
	} catch (error) {
		console.error('Error fetching submissions:', error);
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 },
		);
	}
}
