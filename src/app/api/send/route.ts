import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { to, subject, html, from } = body;

		if (!to || !subject || !html) {
			return NextResponse.json(
				{
					error:
						'Missing required fields: to, subject, and html or text are required.',
				},
				{ status: 400 },
			);
		}

		const emailOptions: any = {
			to,
			subject,
			from: from || 'Edu-assign-help Team <onboarding@resend.dev>',
		};
		if (html) emailOptions.html = html;

		const { data, error } = await resend.emails.send(emailOptions);

		if (error) {
			return NextResponse.json({ error }, { status: 500 });
		}

		return NextResponse.json({ success: true, data });
	} catch (error) {
		return NextResponse.json(
			{ error: 'Failed to send email' },
			{ status: 500 },
		);
	}
}
