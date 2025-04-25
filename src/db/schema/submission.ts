import {
	pgTable,
	timestamp,
	text,
	boolean,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import user from './user';
import freelancer from './freelancers';
import { order } from './order';

export const submissions = pgTable('submissions', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	orderId: text('order_id')
		.notNull()
		.references(() => order.id),
	freelancerId: text('freelancer_id')
		.notNull()
		.references(() => freelancer.id),
	fileUrls: text('file_urls').notNull(), // JSON stringified array of URLs: JSON.stringify(["url1", "url2"])
	comment: text('comment'),
	status: text('status').notNull().default('pending'), // 'pending', 'approved', 'rejected'
	adminFeedback: text('admin_feedback'),
	reviewedBy: text('reviewed_by').references(() => user.id),
	isDelivered: boolean('is_delivered').default(false),
	deliveredAt: timestamp('delivered_at', { mode: 'string' }),
	createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});

export const submissionsRelations = relations(submissions, ({ one }) => ({
	order: one(order, {
		fields: [submissions.orderId],
		references: [order.id],
	}),
	freelancer: one(freelancer, {
		fields: [submissions.freelancerId],
		references: [freelancer.id],
	}),
	reviewer: one(user, {
		fields: [submissions.reviewedBy],
		references: [user.id],
	}),
}));

export default submissions; 