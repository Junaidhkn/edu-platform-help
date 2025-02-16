import { pgTable, timestamp, numeric, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

import user from './user';
import service from './services';
import freelancer from './freelancers';

const order = pgTable('orders', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	deadline: timestamp('estimated_delivery_time', {
		mode: 'string',
	}).notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	serviceId: text('service_id')
		.notNull()
		.references(() => service.id),
	freelancerId: text('freelancer_id')
		.notNull()
		.references(() => freelancer.id),
	orderStatus: text('order_status').notNull().default('pending'),
	total_price: numeric('total_price', { precision: 12, scale: 2 }).notNull(),
	createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});

export const orderRelations = relations(order, ({ one }) => ({
	user: one(user, {
		fields: [order.userId],
		references: [user.id],
	}),
	service: one(service, {
		fields: [order.serviceId],
		references: [service.id],
	}),
	freelancer: one(freelancer, {
		fields: [order.freelancerId],
		references: [freelancer.id],
	}),
}));

export default order;
