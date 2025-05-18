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
import { oauthVerifyEmailAction } from '@/src/app/actions/oauth-verify-email-action';
import { USER_ROLES } from '@/src/lib/constants';
import type { AdapterUser } from '@auth/core/adapters';
import { getTableColumns } from 'drizzle-orm';
import { findAdminUserEmailAddresses } from './src/app/resources/admin-user-email-address-queries';
import { eq } from 'drizzle-orm';
import { freelancers } from '@/src/db/schema';

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
			const { pathname } = request.nextUrl;
			const isLoggedIn = !!auth?.user;

			// Public routes
			if (
				pathname === '/' ||
				pathname.startsWith('/auth') ||
				pathname.startsWith('/api/auth')
			) {
				return true;
			}

			// Protected routes
			if (!isLoggedIn) {
				return false;
			}

			// Admin routes
			if (
				pathname.startsWith('/dashboard') &&
				auth?.user?.role !== USER_ROLES.ADMIN
			) {
				return false;
			}

			// Freelancer routes
			if (
				pathname.startsWith('/freelancer') &&
				!(auth?.user as any)?.isFreelancer
			) {
				return false;
			}

			return true;
		},
		async jwt({ token, user, trigger, session }) {
			if (trigger === 'update') {
				return { ...token, ...session.user };
			}

			if (user?.id) token.id = user.id;
			if (user?.role) token.role = user.role;

			// Add isFreelancer flag if it exists
			if ((user as any)?.isFreelancer) {
				(token as any).isFreelancer = true;
			}

			return token;
		},
		session({ session, token }) {
			session.user.id = token.id;
			session.user.role = token.role;

			// Add isFreelancer flag if it exists
			if ((token as any)?.isFreelancer) {
				(session.user as any).isFreelancer = true;
			}

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
