import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/src/components/navbar';
import { Providers } from '@/src/components/providers';
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin';
import { extractRouterConfig } from 'uploadthing/server';
import { ourFileRouter } from '@/src/app/api/uploadthing/core';
import '@uploadthing/react/styles.css';
import Footer from '@/src/components/Footer';
import TawkWidget from '../components/tawkWidget';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Top Nerd - Assignment Help & Freelancing',
	description:
		'Connect with top-tier freelancers for all your academic needs and programming solutions. Quality work, on time, every time.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={inter.className}>
				<NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
				<Providers>
					<Navbar />
					{children}
					<TawkWidget />
					<Footer />
				</Providers>
			</body>
		</html>
	);
}
