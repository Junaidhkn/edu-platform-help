import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import db from '@/src/db';
import { orders } from '@/src/db/schema';
import { eq, desc } from 'drizzle-orm';
import FreelancerOrdersTable from '@/components/freelancer/FreelancerOrdersTable';

export const metadata = {
  title: 'My Assigned Orders | Freelancer Dashboard',
  description: 'View and manage your assigned orders.',
};

export default async function FreelancerOrdersPage() {
  const session = await auth();
  
  // Redirect if not logged in
  if (!session?.user) {
    redirect('/login');
  }

  // Need to ensure user id exists
  const userId = session.user.id;
  if (!userId) {
    redirect('/login');
  }
  
  // Fetch freelancer's assigned orders
  const assignedOrdersRaw = await db.query.orders.findMany({
    where: (order) => eq(order.freelancerId, userId),
    orderBy: [desc(orders.createdAt)],
    with: {
      user: {
        columns: {
          name: true,
          email: true,
        },
      },
    },
  });

  // Convert the wordCount field to handle null values for the component
  const assignedOrders = assignedOrdersRaw.map(order => ({
    ...order,
    wordCount: order.wordCount || 0 // Provide default value for wordCount
  }));
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Assigned Orders</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            {assignedOrders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">You don't have any assigned orders yet.</p>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-medium mb-4">
                  Showing {assignedOrders.length} assigned order{assignedOrders.length !== 1 ? 's' : ''}
                </h2>
                <FreelancerOrdersTable orders={assignedOrders} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 