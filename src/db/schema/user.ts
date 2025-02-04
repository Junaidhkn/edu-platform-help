import { relations, sql, SQL } from 'drizzle-orm';
import {
	boolean,
	timestamp,
	pgTable,
	text,
	primaryKey,
	integer,
	pgEnum,
	type AnyPgColumn,
	uniqueIndex,
} from 'drizzle-orm/pg-core';
import order from './order';

import type { AdapterAccountType } from 'next-auth/adapters';

// custom lower function
export function lower(email: AnyPgColumn): SQL {
	return sql`lower(${email})`;
}

export const user = pgTable(
	'user',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		name: text('name'),
		email: text('email').notNull(),
		emailVerified: timestamp('emailVerified', { mode: 'date' }),
		image: text('image'),
		password: text('password'),
		role: text('role').notNull().default('user'),
	},
	(table) => ({
		emailUniqueIndex: uniqueIndex('emailUniqueIndex').on(lower(table.email)),
	}),
);

export const adminUserEmailAddresses = pgTable(
	'adminUserEmailAddresses',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		email: text('email').notNull(),
	},
	(table) => ({
		adminEmailUniqueIndex: uniqueIndex('adminEmailUniqueIndex').on(
			lower(table.email),
		),
	}),
);

export const accounts = pgTable(
	'account',
	{
		userId: text('userId')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		type: text('type').$type<AdapterAccountType>().notNull(),
		provider: text('provider').notNull(),
		providerAccountId: text('providerAccountId').notNull(),
		refresh_token: text('refresh_token'),
		access_token: text('access_token'),
		expires_at: integer('expires_at'),
		token_type: text('token_type'),
		scope: text('scope'),
		id_token: text('id_token'),
		session_state: text('session_state'),
	},
	(account) => ({
		compoundKey: primaryKey({
			columns: [account.provider, account.providerAccountId],
		}),
	}),
);

export const sessions = pgTable('session', {
	sessionToken: text('sessionToken').primaryKey(),
	userId: text('userId')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable(
	'verificationToken',
	{
		identifier: text('identifier').notNull(),
		token: text('token').notNull(),
		expires: timestamp('expires', { mode: 'date' }).notNull(),
	},
	(verificationToken) => ({
		compositePk: primaryKey({
			columns: [verificationToken.identifier, verificationToken.token],
		}),
	}),
);

export const authenticators = pgTable(
	'authenticator',
	{
		credentialID: text('credentialID').notNull().unique(),
		userId: text('userId')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		providerAccountId: text('providerAccountId').notNull(),
		credentialPublicKey: text('credentialPublicKey').notNull(),
		counter: integer('counter').notNull(),
		credentialDeviceType: text('credentialDeviceType').notNull(),
		credentialBackedUp: boolean('credentialBackedUp').notNull(),
		transports: text('transports'),
	},
	(authenticator) => ({
		compositePK: primaryKey({
			columns: [authenticator.userId, authenticator.credentialID],
		}),
	}),
);

export const userRelations = relations(user, ({ many }) => ({
	orders: many(order),
}));

export default user;
