import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import db from '@/src/db';
import { z } from 'zod';
import { orders } from '@/src/db/schema';
import type { OrderInsert } from '@/src/db/schema/order';

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
		// 1) Authenticate
		const session = await auth();
		if (!session?.user || !session.user.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		// 2) Validate input
		const body = await req.json();
		const data = orderCreateSchema.parse(body);

		// 3) Compute derived fields
		const pages = data.pages ?? Math.ceil(data.wordCount / 250);

		// 4) Build a fully‑typed insert payload
		const insertData: OrderInsert = {
			userId: session.user.id,
			wordCount: data.wordCount, // integer column
			pages, // integer column
			subjectCategory: data.subject, // maps to `subject_category`
			typeCategory: data.typeCategory, // maps to `type_category`
			academicLevel: data.academicLevel, // maps to `academic_level`
			deadline: new Date(data.deadline).toISOString(), // timestamp column
			description: data.description,
			uploadedfileslink: JSON.stringify(data.fileUrls ?? []),
			price: data.price.toString(), // numeric column
			total_price: data.totalPrice.toString(), // numeric column
			orderStatus: 'pending', // maps to `order_status`
			isPaid: false, // boolean column
		};

		// 5) Insert and return the new order’s ID
		const [created] = await db.insert(orders).values(insertData).returning(); // returns full row

		return NextResponse.json(
			{ message: 'Order created successfully', orderId: created.id },
			{ status: 201 },
		);
	} catch (err) {
		console.error('Error creating order:', err);

		if (err instanceof z.ZodError) {
			return NextResponse.json(
				{ error: 'Validation error', details: err.errors },
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{ error: 'Failed to create order' },
			{ status: 500 },
		);
	}
}
