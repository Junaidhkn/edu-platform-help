import { NextRequest } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
	try {
		const from = `Top Nerd Team ${
			process.env.ADMIN_NAME || 'admin@topnerd.co.uk'
		}`;
		const body = await req.json();
		const { to, subject, html } = body;
		const { data, error } = await resend.emails.send({
			from,
			to,
			subject,
			html,
		});

		if (error) {
			return Response.json({ error }, { status: 500 });
		}

		return Response.json(data);
	} catch (error) {
		return Response.json({ error }, { status: 500 });
	}
}
