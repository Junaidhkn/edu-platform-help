import { pgTable, integer, timestamp, uuid, text, pgEnum } from 'drizzle-orm/pg-core';

import user from './user';
import order from './order';
import { relations } from 'drizzle-orm';

// Add a status enum for payment status
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'processing', 'succeeded', 'failed']);

const transaction = pgTable('transaction', {
	id: uuid('id').defaultRandom().primaryKey(),
	orderId: text('order_id')
		.notNull()
		.references(() => order.id),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	amount: integer('amount').notNull(),
	status: paymentStatusEnum('status').notNull().default('pending'),
	stripePaymentIntentId: text('stripe_payment_intent_id'),
	stripeSessionId: text('stripe_session_id'),
	createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
});

export const transactionRelations = relations(transaction, ({ one }) => ({
	user: one(user, {
		fields: [transaction.userId],
		references: [user.id],
	}),
	order: one(order, {
		fields: [transaction.orderId],
		references: [order.id],
	}),
}));

export default transaction;
