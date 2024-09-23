import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

const statusCatalog = pgTable('status_catalog', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 255 }).notNull().unique(),
});

export default statusCatalog;
