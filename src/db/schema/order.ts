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

import user from './user';

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
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	orderStatus: orderStatusEnum('order_status').notNull().default('pending'),
	assignmentDetail: text('assignment_detail').notNull(),
	total_price: numeric('total_price', { precision: 12, scale: 2 }).notNull(),
	createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});

export const orderRelations = relations(order, ({ one }) => ({
	user: one(user, {
		fields: [order.userId],
		references: [user.id],
	}),
}));

export default order;
