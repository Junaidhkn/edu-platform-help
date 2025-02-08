import {
	pgTable,
	integer,
	timestamp,
	numeric,
	text,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

import { randomUUID } from 'crypto';
import order from './order';

const id = () => {
	return text('service_id')
		.primaryKey()
		.$default(() => randomUUID());
};

const service = pgTable('services', {
	id: id(),
	typeCategory: text('type_category').notNull().default('coursework'),
	subjectCategory: text('subject_category').notNull().default('arts'),
	estimatedDeliveryTime: timestamp('estimated_delivery_time', {
		mode: 'string',
	}).notNull(),
	pages: integer('pages').notNull(),
	uploadedfileslink: text('file_links').notNull(),
	academicLevel: text('academic_level').notNull().default('undergraduate'),
	price: numeric('price', { precision: 12, scale: 2 }).notNull(),
	description: text('description').notNull(),
});

export const serviceRelations = relations(service, ({ many }) => ({
	orders: many(order),
}));

export default service;
