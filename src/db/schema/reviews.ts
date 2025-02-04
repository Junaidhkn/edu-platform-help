import {
	pgTable,
	serial,
	integer,
	timestamp,
	text,
	boolean,
} from 'drizzle-orm/pg-core';

import user from './user';
import order from './order';
import { relations } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import freelancer from './freelancers';
import service from './servces';

const id = () => {
	return text('review_id')
		.primaryKey()
		.$default(() => randomUUID());
};

const review = pgTable('reviews', {
	id: id(),
	orderId: integer('order_id')
		.notNull()
		.references(() => order.id),
	customerId: integer('customer_id')
		.notNull()
		.references(() => user.id),
	freelanceId: integer('freelance_id')
		.notNull()
		.references(() => freelancer.id),
	serviceId: integer('service_id')
		.notNull()
		.references(() => service.id),
	reviewText: text('review_text').notNull(),
	rating: integer('rating').notNull(),
	createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});

export const commentRelations = relations(review, ({ one }) => ({
	user: one(user, {
		fields: [review.customerId],
		references: [user.id],
	}),
	order: one(order, {
		fields: [review.orderId],
		references: [order.id],
	}),
}));

export default review;
