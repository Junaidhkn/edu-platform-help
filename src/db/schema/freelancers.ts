import { relations } from 'drizzle-orm';
import {
	numeric,
	pgEnum,
	pgTable,
	text,
	timestamp,
	varchar,
} from 'drizzle-orm/pg-core';

import order from './order';

const availabilityStatusEnum = pgEnum('availability_status', [
	'available',
	'busy',
]);

const freelancer = pgTable('freelancers', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	firstName: varchar('name', { length: 255 }).notNull(),
	lastName: varchar('name', { length: 255 }).notNull(),
	phone: varchar('contact_phone', { length: 255 }).notNull().unique(),
	email: varchar('email', { length: 255 }).notNull().unique(),
	skills: text('skills').notNull(),
	profileDescription: text('profile_description').notNull(),
	profileLink: text('profile_link'),
	imageURI: text('image_uri'),
	password: varchar('password', { length: 255 }).notNull(),
	rating: numeric('rating'),
	availabilityStatus: availabilityStatusEnum('availability_status')
		.notNull()
		.default('available'),
	createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});

export const freelancerRelations = relations(freelancer, ({ many }) => ({
	orders: many(order),
}));

export default freelancer;
