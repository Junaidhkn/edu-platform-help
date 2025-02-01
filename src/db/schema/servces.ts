import {
	pgTable,
	integer,
	timestamp,
	numeric,
	text,
	pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

import user from './customer';
import { randomUUID } from 'crypto';

const id = () => {
	return text('service_id')
		.primaryKey()
		.$default(() => randomUUID());
};

export const serviceCategoryEnum = pgEnum('service_category', [
	'AI',
	'Data Analysis',
	'Accounting',
	'Essay Writing',
]);

const service = pgTable('services', {
	id: id(),
	serviceCategory: serviceCategoryEnum('service_category')
		.notNull()
		.default('Essay Writing'),
	estimatedDeliveryTime: timestamp('estimated_delivery_time', {
		mode: 'string',
	}).notNull(),
	userId: integer('user_id')
		.notNull()
		.references(() => user.id),
	price: numeric('price', { precision: 12, scale: 2 }).notNull(),
	description: text('description').notNull(),
	createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});

export const orderRelations = relations(service, ({ one }) => ({
	user: one(user, {
		fields: [service.userId],
		references: [user.id],
	}),
}));

export default service;
