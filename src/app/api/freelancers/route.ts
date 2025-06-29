import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import db from '@/src/db';
import { freelancers } from '@/src/db/schema';
import { freelancerFormSchema } from '@/src/lib/validators/freelancer-schema';
import bcrypt from 'bcryptjs';

export async function GET() {
	try {
		const session = await auth();

		if (!session || session.user?.role !== 'admin') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const allFreelancers = await db.select().from(freelancers);

		return NextResponse.json(allFreelancers);
	} catch (error) {
		console.error('Error fetching freelancers:', error);
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 },
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const session = await auth();

		if (!session || session.user?.role !== 'admin') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const body = await request.json();

		// Validate the request body
		const validationResult = freelancerFormSchema.safeParse(body);

		if (!validationResult.success) {
			return NextResponse.json(
				{ error: 'Invalid input', details: validationResult.error.format() },
				{ status: 400 },
			);
		}

		const {
			firstName,
			lastName,
			email,
			phone,
			skills,
			profileDescription,
			profileLink,
			imageURI,
			password,
		} = validationResult.data;

		// Check if freelancer with email already exists
		const existingFreelancer = await db.query.freelancers.findFirst({
			where: (freelancer, { eq }) => eq(freelancer.email, email),
		});

		if (existingFreelancer) {
			return NextResponse.json(
				{ error: 'Freelancer with this email already exists' },
				{ status: 400 },
			);
		}

		const salt = bcrypt.genSaltSync(10);
		const hashedPassword = bcrypt.hashSync(password, salt);

		// Create the freelancer
		const newFreelancer = await db
			.insert(freelancers)
			.values({
				firstName,
				lastName,
				email,
				phone,
				skills,
				profileDescription,
				profileLink: profileLink || null,
				imageURI: imageURI || null,
				password: hashedPassword,
				availabilityStatus: 'available',
			})
			.returning();

		return NextResponse.json(newFreelancer[0], { status: 201 });
	} catch (error) {
		console.error('Error creating freelancer:', error);
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 },
		);
	}
}
