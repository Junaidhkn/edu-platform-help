'use server';

import { findUserByEmail } from '@/src/app/resources/queries';
import { ForgotPasswordSchema } from '@/validators/forgot-password-validator';
import * as v from 'valibot';
import { createVerificationTokenAction } from '@/src/app/actions/create-verification-token-action';
import { sendForgotPasswordEmail } from '@/src/app/actions/mail/send-forgot-password-email';

type Res =
	| { success: true }
	| { success: false; error: v.FlatErrors<undefined>; statusCode: 400 }
	| { success: false; error: string; statusCode: 401 | 500 };

export async function forgotPasswordAction(values: unknown): Promise<Res> {
	const parsedValues = v.safeParse(ForgotPasswordSchema, values);

	if (!parsedValues.success) {
		const flatErrors = v.flatten(parsedValues.issues);
		return { success: false, error: flatErrors, statusCode: 400 };
	}

	const email = parsedValues.output.email;

	try {
		const existingUser = await findUserByEmail(email);

		// this is a false positive, to deter malicious users
		if (!existingUser?.id) return { success: true };

		if (!existingUser.password) {
			return {
				success: false,
				error: 'This user was created with OAuth, please sign in with OAuth',
				statusCode: 401,
			};
		}

		const verificationToken = await createVerificationTokenAction(
			existingUser.email,
		);

		await sendForgotPasswordEmail({
			email: existingUser.email,
			token: verificationToken.token,
		});

		return { success: true };
	} catch (err) {
		console.error(err);
		return { success: false, error: 'Internal Server Error', statusCode: 500 };
	}
}
