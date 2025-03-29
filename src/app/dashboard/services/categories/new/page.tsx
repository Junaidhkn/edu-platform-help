import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { NewCategoryForm } from '@/components/admin/NewCategoryForm';

export const metadata = {
  title: 'Add Subject Category | Admin Dashboard',
  description: 'Add a new subject category to the system.',
};

export default async function NewCategoryPage() {
  const session = await auth();

  if (!session || session.user?.role !== 'admin') {
    redirect('/login');
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Add New Subject Category</h1>
        <Link
          href="/dashboard/services"
          className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          Back to Services
        </Link>
      </div>
      <div className="rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
        <NewCategoryForm />
      </div>
    </div>
  );
} 