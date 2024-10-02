import { relations } from 'drizzle-orm';
import {
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
	varchar,
} from 'drizzle-orm/pg-core';

import order from './order';
import { randomUUID } from 'crypto';

const id = () => {
	return text('freelancer_id')
		.primaryKey()
		.$default(() => randomUUID());
};

const availabilityStatusEnum = pgEnum('availability_status', [
	'available',
	'busy',
]);

const freelancer = pgTable('freelancers', {
	id: id(),
	firstName: varchar('name', { length: 255 }).notNull(),
	lastName: varchar('name', { length: 255 }).notNull(),
	phone: varchar('contact_phone', { length: 255 }).notNull().unique(),
	email: varchar('email', { length: 255 }).notNull().unique(),
	skills: text('skills').notNull(),
	profileDescription: text('profile_description').notNull(),
	password: varchar('password', { length: 255 }).notNull(),
	rating: integer('rating'),
	availabilityStatus: availabilityStatusEnum('status'),
	createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});

export const customerRelations = relations(freelancer, ({ many }) => ({
	orders: many(order),
}));

export default freelancer;
