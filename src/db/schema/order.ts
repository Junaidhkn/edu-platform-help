import {
	pgTable,
	timestamp,
	numeric,
	text,
	integer,
	boolean,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

import user from './user';
import freelancer from './freelancers';

export const order = pgTable('orders', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	deadline: timestamp('estimated_delivery_time', {
		mode: 'string',
	}).notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	typeCategory: text('type_category').notNull().default('coursework'),
	subjectCategory: text('subject_category').notNull().default('arts'),
	pages: integer('pages'),
	wordCount: integer('word_count'),
	uploadedfileslink: text('file_links'),
	academicLevel: text('academic_level').notNull().default('undergraduate'),
	price: numeric('price', { precision: 12, scale: 2 }).notNull(),
	description: text('description').notNull(),
	freelancerId: text('freelancer_id').references(() => freelancer.id),
	orderStatus: text('order_status').notNull().default('pending'),
	total_price: numeric('total_price', { precision: 12, scale: 2 }).notNull(),
	isPaid: boolean('is_paid').default(false),
	paymentMethod: text('payment_method'),
	paymentDate: timestamp('payment_date', { mode: 'string' }),
	completedFileUrls: text('completed_file_urls'),
	comments: text('comments'),
	createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});

export const orderRelations = relations(order, ({ one, many }) => ({
	user: one(user, {
		fields: [order.userId],
		references: [user.id],
	}),
	freelancer: one(freelancer, {
		fields: [order.freelancerId],
		references: [freelancer.id],
	}),
	transactions: many(order, {
		relationName: 'order_transactions',
	}),
}));

export default order;
