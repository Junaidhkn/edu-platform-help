import {
	pgTable,
	serial,
	integer,
	timestamp,
	text,
	boolean,
} from 'drizzle-orm/pg-core';

import customer from './customer';
import order from './order';
import { relations } from 'drizzle-orm';
import { randomUUID } from 'crypto';

const id = () => {
	return text('trasaction_id')
		.primaryKey()
		.$default(() => randomUUID());
};

const transaction = pgTable('transaction', {
	id: id(),
	orderId: integer('order_id')
		.notNull()
		.references(() => order.id),
	customerId: integer('customer_id')
		.notNull()
		.references(() => customer.id),
	amount: integer('amount').notNull(),
	createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
});

export const commentRelations = relations(transaction, ({ one }) => ({
	user: one(customer, {
		fields: [transaction.customerId],
		references: [customer.id],
	}),
	order: one(order, {
		fields: [transaction.orderId],
		references: [order.id],
	}),
}));

export default transaction;
