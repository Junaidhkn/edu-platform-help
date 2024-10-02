import { relations } from 'drizzle-orm';
import { pgEnum, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

import order from './order';
import { randomUUID } from 'crypto';
const statusEnum = pgEnum('status', ['draft', 'active', 'dilevered']);
const acedemicLevelEnum = pgEnum('acedemic_level', [
	'undergraduate',
	'graduate',
]);
// status: statusEnum('status')

const id = () => {
	return text('customer_id')
		.primaryKey()
		.$default(() => randomUUID());
};

const customer = pgTable('customers', {
	id: id(),
	firstName: varchar('name', { length: 255 }).notNull(),
	lastName: varchar('name', { length: 255 }).notNull(),
	phone: varchar('contact_phone', { length: 255 }).notNull().unique(),
	email: varchar('email', { length: 255 }).notNull().unique(),
	acedemicLevel: acedemicLevelEnum('status'),
	password: varchar('password', { length: 255 }).notNull(),
	createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});

export const customerRelations = relations(customer, ({ many }) => ({
	orders: many(order),
}));

export default customer;
