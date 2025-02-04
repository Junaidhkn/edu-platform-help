import {
	pgTable,
	integer,
	timestamp,
	numeric,
	text,
	pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

import user from './user';
import { randomUUID } from 'crypto';

const id = () => {
	return text('service_id')
		.primaryKey()
		.$default(() => randomUUID());
};

export const typeCategoryEnum = pgEnum('type_category', [
	'coursework',
	'bookreport',
	'researchpaper',
	'thesis',
	'proposal',
]);

const academicLevelEnum = pgEnum('academic_level', [
	'undergraduate',
	'graduate',
	'doctorate',
]);

const subjectEnum = pgEnum('subject', ['arts', 'business', 'cs', 'em']);

const service = pgTable('services', {
	id: id(),
	typeCategory: typeCategoryEnum('type_category')
		.notNull()
		.default('coursework'),
	subjectCategory: subjectEnum('subject').notNull().default('arts'),
	estimatedDeliveryTime: timestamp('estimated_delivery_time', {
		mode: 'string',
	}).notNull(),
	pages: integer('pages').notNull(),
	academicLevel: academicLevelEnum('academic_level')
		.notNull()
		.default('undergraduate'),
	userId: integer('user_id')
		.notNull()
		.references(() => user.id),
	price: numeric('price', { precision: 12, scale: 2 }).notNull(),
	description: text('description').notNull(),
});

export const orderRelations = relations(service, ({ one }) => ({
	user: one(user, {
		fields: [service.userId],
		references: [user.id],
	}),
}));

export default service;
