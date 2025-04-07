

// import type { Metadata } from 'next';
// import { Inter } from 'next/font/google';
// import './globals.css';
// import { Navbar } from '@/components/navbar';
// import { Providers } from '@/components/providers';
// import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin';
// import { extractRouterConfig } from 'uploadthing/server';
// import { ourFileRouter } from './api/uploadthing/core';
// import { Toaster } from '@/components/ui/toaster';
// import NextTopLoader from 'nextjs-toploader';
// import { auth } from '@/auth';
// import '@uploadthing/react/styles.css';

// const inter = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {
// 	title: 'Create Next App',
// 	description: 'Generated by create next app',
// };

// export default async function RootLayout({
// 	children,
// }: Readonly<{
// 	children: React.ReactNode;
// }>) {
// 	const session = await auth();
// 	return (
// 		<html lang='en'>
// 			<body
// 				className={`${inter.className} overflow-hidden `}
// 				suppressHydrationWarning={true}>
// 				<NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
// 				<NextTopLoader showSpinner={false} />
// 				<Providers>
// 					<Navbar />
// 					<Toaster />
// 					{children}
// 				</Providers>
// 			</body>
// 		</html>
// 	);
// }


import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}