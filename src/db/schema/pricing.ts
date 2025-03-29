import { pgTable, text, timestamp, numeric, uuid, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Academic Levels
export const academicLevels = pgTable('academic_levels', {
  id: text('id').primaryKey(), // e.g., 'undergraduate', 'masters', 'phd'
  name: text('name').notNull(), // Display name: e.g., "Undergraduate"
  basePrice: numeric('base_price', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});

// Subject Categories
export const subjectCategories = pgTable('subject_categories', {
  id: text('id').primaryKey(), // e.g., 'arts', 'business', 'cs', 'em'
  name: text('name').notNull(), // Display name: e.g., "Arts & Humanities"
  priceModifier: numeric('price_modifier', { precision: 5, scale: 3 }).notNull().default('1'),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});

// Assignment Types
export const assignmentTypes = pgTable('assignment_types', {
  id: text('id').primaryKey(), // e.g., 'coursework', 'research_paper', 'thesis'
  name: text('name').notNull(), // Display name: e.g., "Coursework"
  priceAdjustment: numeric('price_adjustment', { precision: 10, scale: 2 }).notNull().default('0'),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});

// Deadline factors
export const deadlineFactors = pgTable('deadline_factors', {
  id: uuid('id').defaultRandom().primaryKey(),
  minDays: numeric('min_days', { precision: 5, scale: 2 }).notNull(),
  maxDays: numeric('max_days', { precision: 5, scale: 2 }),
  factor: numeric('factor', { precision: 5, scale: 3 }).notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});

// Set up relations
export const academicLevelRelations = relations(academicLevels, ({ many }) => ({
  // Add relations if needed
}));

export const subjectCategoryRelations = relations(subjectCategories, ({ many }) => ({
  // Add relations if needed
}));

export const assignmentTypeRelations = relations(assignmentTypes, ({ many }) => ({
  // Add relations if needed
}));

export default {
  academicLevels,
  subjectCategories,
  assignmentTypes,
  deadlineFactors
}; 