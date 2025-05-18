import Header from '@/src/components/layout/header';
import Sidebar from '@/src/components/layout/sidebar';
import type { Metadata } from 'next';
import { ensureAdmin } from '@/src/lib/admin/ensure-admin';
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin';
import { extractRouterConfig } from 'uploadthing/server';
import { ourFileRouter } from '@/src/app/api/uploadthing/core';
import '@uploadthing/react/styles.css';

export const metadata: Metadata = {
	title: 'Admin Dashboard',
	description: 'Admin dashboard for management',
};

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// Ensure the user is an admin at the layout level
	await ensureAdmin();

	return (
		<div className='flex'>
			<NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
			<Sidebar />
			<main className='w-full flex-1 overflow-hidden'>
				<Header />
				{children}
			</main>
		</div>
	);
}
