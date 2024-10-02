import {
	pgTable,
	serial,
	integer,
	timestamp,
	numeric,
	text,
	pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

import orderStatus from './orderStatus';
import customer from './customer';

const orderStatusEnum = pgEnum('order_status', [
	'pending',
	'in progress',
	'completed',
	'cancelled',
]);

const order = pgTable('orders', {
	id: serial('id').primaryKey(),
	deadline: timestamp('estimated_delivery_time', {
		mode: 'string',
	}).notNull(),
	costomerId: integer('customer_id')
		.notNull()
		.references(() => customer.id),
	assignmentDetail: text('assignment_detail').notNull(),
	price: numeric('price', { precision: 12, scale: 2 }).notNull(),
	createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});

export const orderRelations = relations(order, ({ one, many }) => ({
	user: one(customer, {
		fields: [order.costomerId],
		references: [customer.id],
	}),
	orderStatuses: many(orderStatus),
}));

export default order;
