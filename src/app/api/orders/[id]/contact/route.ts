import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import db from '@/src/db';
import { orders } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Validation schema for the request body
const contactSchema = z.object({
	subject: z.string().min(5),
	message: z.string().min(10),
	email: z.string().email(),
	name: z.string().optional(),
});

export async function POST(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		// Check authentication
		const session = await auth();
		if (!session?.user || session.user.role !== 'admin') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const orderId = params.id;

		// Validate the order exists
		const orderExists = await db.query.orders.findFirst({
			where: eq(orders.id, orderId),
		});

		if (!orderExists) {
			return NextResponse.json({ error: 'Order not found' }, { status: 404 });
		}

		// Parse and validate request body
		const body = await req.json();
		const validationResult = contactSchema.safeParse(body);

		if (!validationResult.success) {
			return NextResponse.json(
				{
					error: 'Validation error',
					details: validationResult.error.format(),
				},
				{ status: 400 },
			);
		}

		const { subject, message, email, name } = validationResult.data;

		// Send email
		await sendContactEmail({
			email,
			name: name || 'Customer',
			subject,
			message,
			orderId,
			adminName: session.user.name || 'Admin',
		});

		return NextResponse.json({
			message: 'Email sent successfully',
		});
	} catch (error) {
		console.error('Error sending contact email:', error);
		return NextResponse.json(
			{
				error: 'Failed to send email',
				details: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	}
}

interface EmailParams {
	email: string;
	name: string;
	subject: string;
	message: string;
	orderId: string;
	adminName: string;
}

async function sendContactEmail({
	email,
	name,
	subject,
	message,
	orderId,
	adminName,
}: EmailParams) {
	await resend.emails.send({
		from: `Top Nerd Team ${process.env.ADMIN_NAME || 'admin@topnerd.co.uk'}`,
		to: email,
		subject: subject,
		html: `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
      <h2 style="text-align: center; color: #3b82f6;">Edu-assign-help</h2>
      <h3>Regarding Order #${orderId.slice(-6)}</h3>

      <div style="white-space: pre-line; margin-top: 20px; margin-bottom: 20px; padding: 15px; background-color: #f9fafb; border-radius: 5px;">
        ${message.replace(/\n/g, '<br />')}
      </div>
      
      <p>If you have any questions, please reply to this email directly.</p>
      
      <p>Best regards,<br />${adminName}<br />Support Team</p>

      <p style="text-align: center; font-size: 12px; color: #aaa; margin-top: 30px;">
        &copy; ${new Date().getFullYear()} Edu-assign-help. All rights reserved.
      </p>
    </div>
    `,
	});

	console.log(`Contact email sent to ${email} regarding order ${orderId}`);
}
