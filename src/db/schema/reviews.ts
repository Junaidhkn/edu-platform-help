import {
	pgTable,
	integer,
	timestamp,
	text,
	numeric,
} from 'drizzle-orm/pg-core';
import user from './user';
import order from './order';
import service from './services';
import freelancer from './freelancers';
import { relations } from 'drizzle-orm';
import { randomUUID } from 'crypto';

const id = () => {
	return text('review_id')
		.primaryKey()
		.$default(() => randomUUID());
};

const review = pgTable('reviews', {
	id: id(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	orderId: text('order_id').references(() => order.id),
	serviceId: text('service_id').references(() => service.id),
	freelanceId: text('freelance_id').references(() => freelancer.id),
	reviewText: text('review_text').notNull(),
	rating: numeric('rating', { precision: 2, scale: 1 }).notNull(),
	createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});

export const reviewRelations = relations(review, ({ one }) => ({
	user: one(user, {
		fields: [review.userId],
		references: [user.id],
	}),
	order: one(order, {
		fields: [review.orderId],
		references: [order.id],
	}),
	service: one(service, {
		fields: [review.serviceId],
		references: [service.id],
	}),
	freelancer: one(freelancer, {
		fields: [review.freelanceId],
		references: [freelancer.id],
	}),
}));

export default review;
