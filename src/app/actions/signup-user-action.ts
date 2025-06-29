'use server';

import * as v from 'valibot';
import { SignupSchema } from '@/validators/signup-validator';

import { eq } from 'drizzle-orm';
import { USER_ROLES } from '@/src/lib/constants';
import { findAdminUserEmailAddresses } from '@/src/app/resources/admin-user-email-address-queries';
import { createVerificationTokenAction } from '@/src/app/actions/create-verification-token-action';
import { sendSignupUserEmail } from '@/src/app/actions/mail/send-signup-user-email';
import db from '@/src/db';
import { users } from '@/src/db/schema';
import { lower } from '@/src/db/schema/user';
import bcrypt from 'bcryptjs';

type Res =
	| { success: true }
	| { success: false; error: v.FlatErrors<undefined>; statusCode: 400 }
	| { success: false; error: string; statusCode: 409 | 500 };

export async function signupUserAction(values: unknown): Promise<Res> {
	const parsedValues = v.safeParse(SignupSchema, values);

	if (!parsedValues.success) {
		const flatErrors = v.flatten(parsedValues.issues);
		console.log(flatErrors);
		return { success: false, error: flatErrors, statusCode: 400 };
	}

	const { name, email, password } = parsedValues.output;

	try {
		const existingUser = await db
			.select({
				id: users.id,
				email: users.email,
				emailVerified: users.emailVerified,
			})
			.from(users)
			.where(eq(lower(users.email), email.toLowerCase()))
			.then((res) => res[0] ?? null);

		if (existingUser?.id) {
			if (!existingUser.emailVerified) {
				const verificationToken = await createVerificationTokenAction(
					existingUser.email,
				);

				await sendSignupUserEmail({
					email: existingUser.email,
					token: verificationToken.token,
				});

				return {
					success: false,
					error: 'User exists but not verified. Verification link resent',
					statusCode: 409,
				};
			} else {
				return {
					success: false,
					error: 'Email already exists',
					statusCode: 409,
				};
			}
		}
	} catch (err) {
		console.error(err);
		return { success: false, error: 'Internal Server Error', statusCode: 500 };
	}

	try {
		const salt = bcrypt.genSaltSync(10);
		const hashedPassword = bcrypt.hashSync(password, salt);
		const adminEmails = await findAdminUserEmailAddresses();
		const isAdmin = adminEmails.includes(email.toLowerCase());

		const newUser = await db
			.insert(users)
			.values({
				name,
				email,
				password: hashedPassword,
				role: isAdmin ? USER_ROLES.ADMIN : USER_ROLES.USER,
			})
			.returning({
				id: users.id,
				email: users.email,
				emailVerified: users.emailVerified,
			})
			.then((res) => res[0]);

		const verificationToken = await createVerificationTokenAction(
			newUser.email,
		);

		await sendSignupUserEmail({
			email: newUser.email,
			token: verificationToken.token,
		});

		return { success: true };
	} catch (err) {
		console.error(err);
		return { success: false, error: 'Internal Server Error', statusCode: 500 };
	}
}
