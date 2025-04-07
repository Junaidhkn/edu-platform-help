import 'server-only';

import db from '@/src/db';
import { lower } from '@/src/db/schema/user';
import { users } from '@/src/db/schema';
import { order } from '@/src/db/schema/order';
import { freelancers } from '@/src/db/schema';
import {
	desc,
	eq,
	getTableColumns,
	//  getTableColumns
} from 'drizzle-orm';
import { USER_ROLES } from '@/lib/constants';
import { auth } from '@/auth';
// import { auth } from "@/auth";

/* ADMIN QUERIES - THESE QUERIES REQUIRE ADMIN ACCESS */
export async function findAllUsers() {
	const session = await auth();

	if (session?.user?.role !== USER_ROLES.ADMIN) {
		throw new Error('Unauthorized');
	}

	const { password, ...rest } = getTableColumns(users);

	const allUsers = await db
		.select({ ...rest })
		.from(users)
		.orderBy(desc(users.role));

	return allUsers;
}
/* -------------------------------------------------- */

export const findUserByEmail = async (
	email: string,
): Promise<typeof users.$inferSelect | null> => {
	// First check in users table
	const user = await db
		.select()
		.from(users)
		.where(eq(lower(users.email), email.toLowerCase()))
		.then((res) => res[0] ?? null);

	if (user) {
		return user;
	}

	// If not found in users table, check in freelancers table
	const freelancer = await db
		.select()
		.from(freelancers)
		.where(eq(lower(freelancers.email), email.toLowerCase()))
		.then((res) => res[0] ?? null);

	if (freelancer) {
		// Convert freelancer to user format with type assertion
		return {
			id: freelancer.id,
			role: USER_ROLES.USER, // Use existing role
			name: `${freelancer.firstName} ${freelancer.lastName}`,
			email: freelancer.email,
			emailVerified: new Date(), // Set emailVerified to allow login
			image: freelancer.imageURI || null,
			password: freelancer.password,
			isFreelancer: true,
		} as any; // Use type assertion to avoid TypeScript errors
	}

	return null;
};

// type UserWithoutPassword = Omit<typeof users.$inferSelect, "password">;

// export const findUserById = async (
//   id: string,
// ): Promise<UserWithoutPassword> => {
//   const { password, ...rest } = getTableColumns(users);

//   const user = await db
//     .select(rest)
//     .from(users)
//     .where(eq(users.id, id))
//     .then((res) => res[0] ?? null);

//   if (!user) throw new Error("User not found.");

//   return user;
// };

// export const findUserByAuth = async () => {
//   const session = await auth();

//   const sessionUserId = session?.user?.id;
//   if (!sessionUserId) throw new Error("Unauthorized");

//   const { password, ...rest } = getTableColumns(users);

//   const user = await db
//     .select(rest)
//     .from(users)
//     .where(eq(users.id, sessionUserId))
//     .then((res) => res[0] ?? null);

//   if (!user) throw new Error("User not found.");

//   return user;
// };

export const findOrdersbyUserId = async (userId: string) => {
	const orders = await db
		.select()
		.from(order)
		.where(eq(order.userId, userId))
		.orderBy(order.createdAt);
	return orders;
};
