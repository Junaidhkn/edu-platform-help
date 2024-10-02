import { pgTable, serial, integer, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

import order from './order';

const orderStatus = pgTable('order_status', {
	id: serial('id').primaryKey(),
	orderId: integer('order_id')
		.notNull()
		.references(() => order.id),
	createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
});

export const orderStatusRelations = relations(orderStatus, ({ one }) => ({
	order: one(order, {
		fields: [orderStatus.orderId],
		references: [order.id],
	}),
}));

export default orderStatus;
