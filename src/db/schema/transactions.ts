import { pgTable, integer, timestamp, uuid, text } from 'drizzle-orm/pg-core';

import user from './user';
import order from './order';
import { relations } from 'drizzle-orm';

const transaction = pgTable('transaction', {
	id: uuid('id').defaultRandom().primaryKey(),
	orderId: text('order_id')
		.notNull()
		.references(() => order.id),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	amount: integer('amount').notNull(),
	createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
});

export const commentRelations = relations(transaction, ({ one }) => ({
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
