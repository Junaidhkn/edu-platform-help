import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import db from '@/src/db';
import { orders } from '@/src/db/schema';
import { desc } from 'drizzle-orm';
import Link from 'next/link';
import OrdersTable from '@/components/admin/OrdersTable';

export const metadata = {
  title: 'Orders | Admin Dashboard',
  description: 'View and manage customer orders',
};

export default async function OrdersPage() {
  const session = await auth();
  
  if (!session?.user || session.user.role !== 'admin') {
    redirect('/');
  }
  
  // Fetch all orders with relations
  const allOrders = await db.query.orders.findMany({
    orderBy: [desc(orders.createdAt)],
    with: {
      user: {
        columns: {
          name: true,
          email: true,
        },
      },
      freelancer: true
    },
  });

  // Count orders by status
  const pendingOrdersCount = allOrders.filter(order => order.orderStatus === 'pending').length;
  const acceptedOrdersCount = allOrders.filter(order => order.orderStatus === 'accepted').length;
  const rejectedOrdersCount = allOrders.filter(order => order.orderStatus === 'rejected').length;

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customer Orders</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-medium mb-4">Order Management</h2>
          <OrdersTable orders={allOrders} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Pending Orders</h3>
          <p className="text-3xl font-bold text-yellow-500">{pendingOrdersCount}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Accepted Orders</h3>
          <p className="text-3xl font-bold text-green-500">{acceptedOrdersCount}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Rejected Orders</h3>
          <p className="text-3xl font-bold text-red-500">{rejectedOrdersCount}</p>
        </div>
      </div>
    </div>
  );
} 