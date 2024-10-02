import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

import { randomUUID } from 'crypto';

const id = () => {
	return text('admin_id')
		.primaryKey()
		.$default(() => randomUUID());
};

const admin = pgTable('admin', {
	id: id(),
	phone: varchar('contact_phone', { length: 255 }).notNull().unique(),
	email: varchar('email', { length: 255 }).notNull().unique(),
	password: varchar('password', { length: 255 }).notNull(),
	createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});

export default admin;
