import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import db from '@/src/db';
import { orders } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import OrderRejectForm from '@/components/admin/OrderRejectForm';

interface RejectOrderPageProps {
  params: {
    id: string;
  };
}

export const metadata = {
  title: 'Reject Order | Admin Dashboard',
  description: 'Reject customer order and send notification',
};

export default async function RejectOrderPage({ params }: RejectOrderPageProps) {
  const session = await auth();
  
  if (!session?.user || session.user.role !== '=admin') {
    redirect('/');
  }
  
  // Fetch order with relations
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, params.id),
    with: {
      user: true,
    },
  });
  
  if (!order) {
    redirect('/dashboard/orders');
  }
  
  // If order is not in pending status, redirect back
  if (order.orderStatus !== 'pending') {
    redirect(`/dashboard/orders/${params.id}`);
  }
  
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Reject Order #{order.id.slice(-6)}</h1>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <OrderRejectForm 
            orderId={order.id} 
            userEmail={order.user?.email || ''} 
            userName={order.user?.name || ''}
          />
        </div>
      </div>
    </div>
  );
} 