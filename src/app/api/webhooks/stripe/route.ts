// src/app/api/webhooks/stripe/route.ts
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import stripe from '@/lib/stripe-server';
import db from '@/src/db';
import transaction from '@/src/db/schema/transactions';
import order from '@/src/db/schema/order';
import { eq } from 'drizzle-orm';

// Helper to convert ReadableStream to Buffer
async function buffer(readable: ReadableStream) {
	const chunks = [];
	const reader = readable.getReader();
	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		chunks.push(typeof value === 'string' ? Buffer.from(value) : value);
	}
	return Buffer.concat(chunks);
}

// Route Segment Config
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
	console.log('📥 Webhook received');
	const body = await req.text(); // raw body access
	const sig = headers().get('stripe-signature');

	if (!sig) {
		console.error('❌ Missing stripe-signature header');
		return NextResponse.json(
			{ error: 'Missing stripe-signature header' },
			{ status: 400 },
		);
	}

	let event;
	if (process.env.STRIPE_WEBHOOK_SECRET) {
		try {
			event = stripe.webhooks.constructEvent(
				body,
				sig,
				process.env.STRIPE_WEBHOOK_SECRET,
			);
			console.log('✅ Webhook signature verified');
		} catch (err: any) {
			console.error(`❌ Signature verification failed: ${err.message}`);
			return NextResponse.json({ error: err.message }, { status: 400 });
		}
	} else {
		console.warn('⚠️ STRIPE_WEBHOOK_SECRET not set; skipping verification');
		event = JSON.parse(body);
	}

	console.log(`📦 Processing event: ${event.type}`);

	// … your existing business logic …

	return NextResponse.json({ received: true });
}
