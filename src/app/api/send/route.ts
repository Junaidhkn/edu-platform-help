import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = `Top Nerd Team ${
	process.env.ADMIN_NAME || 'admin@topnerd.co.uk'
}`;

export async function POST(req: NextRequest) {
	try {
		const { to, subject, html } = await req.json();

		if (!to || !subject || !html) {
			return NextResponse.json(
				{ error: 'Missing required fields' },
				{ status: 400 },
			);
		}

		const { data, error } = await resend.emails.send({
			from: FROM_EMAIL,
			to: to,
			subject: subject,
			html: html,
		});

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json(data);
	} catch (error) {
		return NextResponse.json(
			{ error: 'An internal server error occurred' },
			{ status: 500 },
		);
	}
}
