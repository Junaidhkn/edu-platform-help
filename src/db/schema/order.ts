import {
	pgTable,
	serial,
	integer,
	timestamp,
	numeric,
	text,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

import user from './user';
import orderStatus from './orderStatus';

const order = pgTable('orders', {
	id: serial('id').primaryKey(),
	estimatedDeliveryTime: timestamp('estimated_delivery_time', {
		mode: 'string',
	}).notNull(),
	actualDeliveryTime: timestamp('actual_delivery_time', { mode: 'string' }),
	userId: integer('user_id')
		.notNull()
		.references(() => user.id),
	price: numeric('price', { precision: 12, scale: 2 }).notNull(),
	discount: numeric('discount', { precision: 12, scale: 2 }).notNull(),
	finalPrice: numeric('final_price', { precision: 12, scale: 2 }).notNull(),
	comment: text('comment'),
	createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});

export const orderRelations = relations(order, ({ one, many }) => ({
	user: one(user, {
		fields: [order.userId],
		references: [user.id],
	}),
	orderStatuses: many(orderStatus),
}));

export default order;
