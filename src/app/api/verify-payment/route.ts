import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/lib/stripe-server';
import db from '@/src/db';
import transaction from '@/src/db/schema/transactions';
import order from '@/src/db/schema/order';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
	try {
		const sessionId = req.nextUrl.searchParams.get('session_id');

		if (!sessionId) {
			console.error('❌ No session ID provided');
			return NextResponse.json(
				{ error: 'Session ID is required' },
				{ status: 400 },
			);
		}

		console.log('🔍 Verifying payment for session:', sessionId);

		// Retrieve the session from Stripe
		const session = await stripe.checkout.sessions.retrieve(sessionId);
		console.log('📦 Session details:', {
			id: session.id,
			status: session.status,
			payment_status: session.payment_status,
			metadata: session.metadata,
		});

		if (session.payment_status === 'paid') {
			// Check if transaction already exists and is marked as succeeded
			const existingTransaction = await db.query.transaction.findFirst({
				where: eq(transaction.stripeSessionId, sessionId),
			});

			console.log(
				'💳 Existing transaction:',
				existingTransaction
					? {
							id: existingTransaction.id,
							status: existingTransaction.status,
					  }
					: 'Not found',
			);

			if (!existingTransaction || existingTransaction.status !== 'succeeded') {
				console.log('💳 Payment is paid, updating database...');

				// Update transaction status
				await db
					.update(transaction)
					.set({
						status: 'succeeded',
						stripePaymentIntentId: session.payment_intent?.toString() || null,
					})
					.where(eq(transaction.stripeSessionId, sessionId));
				console.log('✅ Transaction updated successfully');

				// Update order status if orderId exists in metadata
				if (session.metadata?.orderId) {
					console.log(`📝 Updating order ${session.metadata.orderId}...`);
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
					return NextResponse.json({
						success: true,
						orderId: session.metadata.orderId,
					});
				} else {
					console.warn('⚠️ No orderId found in session metadata');
				}
			} else {
				console.log('✅ Transaction already marked as succeeded');
				return NextResponse.json({
					success: true,
					orderId: session.metadata?.orderId,
				});
			}
		} else {
			console.log('⚠️ Payment not completed. Status:', session.payment_status);
		}

		return NextResponse.json({
			success: false,
			message: 'Payment not completed',
		});
	} catch (error) {
		console.error('❌ Error verifying payment:', error);
		return NextResponse.json(
			{ error: 'Failed to verify payment' },
			{ status: 500 },
		);
	}
}
