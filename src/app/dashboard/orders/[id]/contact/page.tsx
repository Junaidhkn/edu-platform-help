import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import db from '@/src/db';
import { orders } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import ContactCustomerForm from '@/components/admin/ContactCustomerForm';

interface ContactCustomerPageProps {
  params: {
    id: string;
  };
}

export const metadata = {
  title: 'Contact Customer | Admin Dashboard',
  description: 'Send email to customer regarding their order',
};

export default async function ContactCustomerPage({ params }: ContactCustomerPageProps) {
  const session = await auth();
  
  if (!session?.user || session.user.role !== 'ADMIN') {
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
  
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Contact Customer for Order #{order.id.slice(-6)}</h1>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <ContactCustomerForm 
            orderId={order.id} 
            userEmail={order.user?.email || ''} 
            userName={order.user?.name || ''}
            orderSubject={order.subjectCategory || ''}
          />
        </div>
      </div>
    </div>
  );
} 