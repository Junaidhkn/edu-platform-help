// import { drizzle } from 'drizzle-orm/postgres-js';
// import postgres from 'postgres';
// import * as schema from '@/src/db/schema';
// import env from '@/src/env';

// export const connection = postgres(env.DATABASE_URL, {
// 	max: env.DB_MIGRATING || env.DB_SEEDING ? 1 : undefined,
// 	onnotice: env.DB_SEEDING ? () => {} : undefined,
// });

// export const db = drizzle(connection, {
// 	schema,
// 	logger: true,
// });

// export type db = typeof db;

// export default db;

// src/db.ts
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';
import env from '@/src/env';

const sql = neon(env.DATABASE_URL);

const db = drizzle(sql, { schema });

export default db;
