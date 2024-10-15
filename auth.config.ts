import { NextAuthConfig } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import db from './src/db';
import {
	accounts,
	sessions,
	user,
	verificationTokens,
} from '@/src/db/schema/user';

const authConfig = {
	adapter: DrizzleAdapter(db, {
		usersTable: user,
		accountsTable: accounts,
		sessionsTable: sessions,
		verificationTokensTable: verificationTokens,
	}),
	providers: [
		Google,
		CredentialProvider({
			credentials: {
				email: {
					type: 'email',
				},
				password: {
					type: 'password',
				},
			},
			async authorize(credentials, req) {
				const user = {
					id: '1',
					name: 'John',
					email: credentials?.email as string,
				};
				if (user) {
					// Any object returned will be saved in `user` property of the JWT
					return user;
				} else {
					// If you return null then an error will be displayed advising the user to check their details.
					return null;

					// You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
				}
			},
		}),
	],
	pages: {
		signIn: '/', //sigin page
	},
} satisfies NextAuthConfig;

export default authConfig;
