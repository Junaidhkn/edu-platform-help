import type { NextAuthConfig } from 'next-auth';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import Google from 'next-auth/providers/google';
import Github from 'next-auth/providers/github';
import db from '@/src/db';
import {
	accounts,
	authenticators,
	sessions,
	verificationTokens,
	user,
} from '@/src/db/schema/user';
import { oauthVerifyEmailAction } from '@/actions/oauth-verify-email-action';
import { USER_ROLES } from '@/lib/constants';
import type { AdapterUser } from '@auth/core/adapters';
import { getTableColumns } from 'drizzle-orm';
import { findAdminUserEmailAddresses } from './resources/admin-user-email-address-queries';

export const authConfig = {
	adapter: {
		...DrizzleAdapter(db, {
			accountsTable: accounts,
			usersTable: user,
			authenticatorsTable: authenticators,
			sessionsTable: sessions,
			verificationTokensTable: verificationTokens,
		}),
		async createUser(data: AdapterUser) {
			const { id, ...insertData } = data;
			const hasDefaultId = getTableColumns(user)['id']['hasDefault'];

			const adminEmails = await findAdminUserEmailAddresses();
			const isAdmin = adminEmails.includes(insertData.email.toLowerCase());

			if (isAdmin) {
				insertData.role = isAdmin ? USER_ROLES.ADMIN : USER_ROLES.USER;
			}

			return db
				.insert(user)
				.values(hasDefaultId ? insertData : { ...insertData, id })
				.returning()
				.then((res) => res[0]);
		},
	},
	session: { strategy: 'jwt' },
	secret: process.env.AUTH_SECRET,
	pages: { signIn: '/auth/signin' },
	callbacks: {
		authorized({ auth, request }) {
			const { nextUrl } = request;

			const isLoggedIn = !!auth?.user;
			const isAdmin = auth?.user?.role === USER_ROLES.ADMIN;
			const isOnProfile = nextUrl.pathname.startsWith('/profile');
			const isOnAuth = nextUrl.pathname.startsWith('/auth');
			const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

			// For dashboard access: require both login and admin role
			if (isOnDashboard) {
				if (!isLoggedIn) return false; // Will redirect to sign in
				if (!isAdmin) return false; // Will redirect to home
				return true;
			}

			// For profile access: only require login
			if (isOnProfile) {
				return isLoggedIn;
			}

			// Let auth pages be accessed by non-logged in users
			if (isOnAuth) {
				if (!isLoggedIn) return true;
				// Auth callbacks will handle redirections after login
				return true;
			}

			return true;
		},
		async jwt({ token, user, trigger, session }) {
			if (trigger === 'update') {
				return { ...token, ...session.user };
			}

			if (user?.id) token.id = user.id;
			if (user?.role) token.role = user.role;

			return token;
		},
		session({ session, token }) {
			session.user.id = token.id;
			session.user.role = token.role;

			return session;
		},
		signIn({ user, account, profile }) {
			if (account?.provider === 'google') {
				return !!profile?.email_verified;
			}

			if (account?.provider === 'github') {
				return true;
			}

			if (account?.provider === 'credentials') {
				if (user.emailVerified) return true;
			}

			return false;
		},
	},
	events: {
		async linkAccount({ user, account }) {
			if (['google', 'github'].includes(account.provider)) {
				if (user.email) await oauthVerifyEmailAction(user.email);
			}
		},
	},
	providers: [
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			allowDangerousEmailAccountLinking: true,
		}),
		Github({
			clientId: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
			allowDangerousEmailAccountLinking: true,
		}),
	],
} satisfies NextAuthConfig;
