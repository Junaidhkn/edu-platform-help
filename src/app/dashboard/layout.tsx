import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import type { Metadata } from 'next';
import { ensureAdmin } from '@/lib/admin/ensure-admin';
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/src/app/api/uploadthing/core";

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Admin dashboard for management'
};

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Ensure the user is an admin at the layout level
  await ensureAdmin();
  
  return (
    <div className="flex">
      <Sidebar />
      <main className="w-full flex-1 overflow-hidden">
      <NextSSRPlugin  routerConfig={extractRouterConfig(ourFileRouter)}
        />
        <Header />
        {children}
      </main>
    </div>
  );
}
