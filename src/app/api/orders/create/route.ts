import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import db from '@/src/db';
import order from '@/src/db/schema/order';
import { z } from 'zod';

const orderCreateSchema = z.object({
	wordCount: z.number().min(250),
	pages: z.number().optional(),
	subject: z.string(),
	typeCategory: z.string(),
	academicLevel: z.string(),
	deadline: z.string(), // ISO date string
	description: z.string().min(10),
	fileUrls: z.array(z.string()).optional(),
	price: z.number().min(0),
	totalPrice: z.number().min(0),
});

export async function POST(req: NextRequest) {
	try {
		// Get the authenticated user
		const session = await auth();
		if (!session?.user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Parse request body
		const body = await req.json();
		const validatedData = orderCreateSchema.parse(body);

		// Calculate pages if not provided
		const pages =
			validatedData.pages || Math.ceil(validatedData.wordCount / 250);

		const newOrder = await db
			.insert(order)
			.values({
				userId: session.user.id,
				wordCount: validatedData.wordCount,
				pages,
				subject: validatedData.subject,
				type: validatedData.typeCategory,
				academicLevel: validatedData.academicLevel,
				deadline: new Date(validatedData.deadline).toISOString(),
				description: validatedData.description,
				fileUrls: JSON.stringify(validatedData.fileUrls || []),
				price: validatedData.price,
				totalPrice: validatedData.totalPrice,
				status: 'pending',
				isPaid: false,
			})
			.returning();
		console.log(newOrder);
		// Return the created order
		return NextResponse.json(
			{
				message: 'Order created successfully',
				orderId: newOrder[0].id,
			},
			{ status: 201 },
		);
	} catch (error) {
		console.error('Error creating order:', error);

		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: 'Validation error', details: error.errors },
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{ error: 'Failed to create order' },
			{ status: 500 },
		);
	}
}
