import { relations } from 'drizzle-orm';
import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

import order from './order';

const user = pgTable('users', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	phone: varchar('contact_phone', { length: 255 }).notNull().unique(),
	email: varchar('email', { length: 255 }).notNull().unique(),
	password: varchar('password', { length: 255 }).notNull(),
	createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
	role: varchar('role', { length: 50 }).default('user').notNull(),
	updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});

export const userRelations = relations(user, ({ many }) => ({
	orders: many(order),
}));

export default user;
