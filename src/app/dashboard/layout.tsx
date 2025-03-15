import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import type { Metadata } from 'next';
import { ensureAdmin } from '@/src/lib/admin/ensure-admin';

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
        <Header />
        <div className="bg-muted/50 p-2 text-center font-medium text-sm">
          ADMIN DASHBOARD
        </div>
        {children}
      </main>
    </div>
  );
}
