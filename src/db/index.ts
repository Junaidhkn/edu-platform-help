import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from '@/src/db/schema';

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

// TODO: logger true
export const db = drizzle(pool, { schema });

export type DB = typeof db;

export default db;
