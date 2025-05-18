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

// Route segment config
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
	try {
		console.log('📥 Webhook received');
		const body = await req.text();
		const signature = headers().get('stripe-signature');

		if (!signature) {
			console.error('❌ Missing stripe-signature header');
			return NextResponse.json(
				{ error: 'Missing stripe-signature header' },
				{ status: 400 },
			);
		}

		let event;

		// Check if we have a webhook secret
		if (!process.env.STRIPE_WEBHOOK_SECRET) {
			console.warn(
				'⚠️ STRIPE_WEBHOOK_SECRET is not set. Webhook verification is disabled.',
			);
			event = JSON.parse(body);
		} else {
			try {
				event = stripe.webhooks.constructEvent(
					body,
					signature,
					process.env.STRIPE_WEBHOOK_SECRET,
				);
				console.log('✅ Webhook signature verified');
			} catch (error: any) {
				console.error(
					`❌ Webhook signature verification failed: ${error.message}`,
				);
				return NextResponse.json(
					{ error: `Webhook Error: ${error.message}` },
					{ status: 400 },
				);
			}
		}

		console.log(`📦 Processing event type: ${event.type}`);

		// Handle different event types
		if (event.type === 'checkout.session.completed') {
			const session = event.data.object;
			console.log(`💰 Processing completed checkout session: ${session.id}`);
			console.log('Session metadata:', session.metadata);
			console.log('Payment status:', session.payment_status);

			try {
				// Check if transaction already exists and is marked as succeeded
				const existingTransaction = await db.query.transaction.findFirst({
					where: eq(transaction.stripeSessionId, session.id),
				});

				if (existingTransaction) {
					console.log('Existing transaction found:', {
						id: existingTransaction.id,
						status: existingTransaction.status,
					});
				}

				// Update transaction status
				console.log('Updating transaction status...');
				await db
					.update(transaction)
					.set({
						status: 'succeeded',
						stripePaymentIntentId: session.payment_intent?.toString() || null,
					})
					.where(eq(transaction.stripeSessionId, session.id));
				console.log('✅ Transaction updated successfully');

				// Update order status if orderId exists in metadata
				if (session.metadata?.orderId) {
					console.log(`Updating order ${session.metadata.orderId}...`);
					await db
						.update(order)
						.set({
							orderStatus: 'pending',
							isPaid: true,
							paymentMethod: 'stripe',
							paymentDate: new Date().toISOString(),
						})
						.where(eq(order.id, session.metadata.orderId));
					console.log('✅ Order updated successfully');
				} else {
					console.warn('⚠️ No orderId found in session metadata');
				}

				console.log(
					`✅ Payment processing completed for session ${session.id}`,
				);
			} catch (error) {
				console.error('❌ Error updating database:', error);
				throw error; // Re-throw to trigger the catch block
			}
		} else if (event.type === 'payment_intent.payment_failed') {
			const paymentIntent = event.data.object;

			try {
				const sessions = await stripe.checkout.sessions.list({
					payment_intent: paymentIntent.id,
				});

				if (sessions.data.length > 0) {
					const session = sessions.data[0];

					// Update transaction status
					await db
						.update(transaction)
						.set({ status: 'failed' })
						.where(eq(transaction.stripePaymentIntentId, paymentIntent.id));

					// Update order status if orderId exists in metadata
					if (session.metadata?.orderId) {
						await db
							.update(order)
							.set({ orderStatus: 'pending' })
							.where(eq(order.id, session.metadata.orderId));
					}

					console.log(`❌ Payment failed for intent ${paymentIntent.id}`);
				}
			} catch (error) {
				console.error('Error processing payment_intent.payment_failed:', error);
			}
		}

		// Return a response to acknowledge receipt of the event
		return NextResponse.json({ received: true });
	} catch (error) {
		console.error('Webhook error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}
