import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FreelancerTable from '@/components/admin/FreelancerTable';
import db from '@/src/db';
import { freelancers } from '@/src/db/schema';
import { desc } from 'drizzle-orm';

export const metadata = {
  title: 'Freelancers | Admin Dashboard',
  description: 'Manage freelancers and assign orders.',
};

export default async function FreelancerDashboardPage() {
  const session = await auth();
  
  if (!session?.user || session.user.role !== 'admin') {
    redirect('/');
  }
  
  // Fetch all freelancers
  const allFreelancersRaw = await db.select().from(freelancers).orderBy(desc(freelancers.createdAt));
  
  // Convert rating from string|null to number|undefined
  const allFreelancers = allFreelancersRaw.map(freelancer => ({
    ...freelancer,
    rating: freelancer.rating ? Number(freelancer.rating) : undefined
  }));
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Freelancers Management</h1>
          <Link href="/dashboard/profile">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Register New Freelancer
            </Button>
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-medium mb-4">Registered Freelancers</h2>
            <FreelancerTable freelancers={allFreelancers} />
          </div>
        </div>
      </div>
    </div>
  );
}
