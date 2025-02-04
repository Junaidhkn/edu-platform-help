import {
	pgTable,
	integer,
	timestamp,
	numeric,
	text,
	pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

import { randomUUID } from 'crypto';
import order from './order';

const id = () => {
	return text('service_id')
		.primaryKey()
		.$default(() => randomUUID());
};

export const typeCategoryEnum = pgEnum('category', [
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
	subjectCategory: subjectEnum('subject_category').notNull().default('arts'),
	estimatedDeliveryTime: timestamp('estimated_delivery_time', {
		mode: 'string',
	}).notNull(),
	pages: integer('pages').notNull(),
	uploadedfileslink: text('file_links').notNull(),
	academicLevel: academicLevelEnum('academic_level')
		.notNull()
		.default('undergraduate'),
	price: numeric('price', { precision: 12, scale: 2 }).notNull(),
	description: text('description').notNull(),
});

export const serviceRelations = relations(service, ({ many }) => ({
	orders: many(order),
}));

export default service;
