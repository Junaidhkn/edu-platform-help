import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import db from '@/src/db';
import order from '@/src/db/schema/order';
import { eq } from 'drizzle-orm';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function OrderCancelPage({
  searchParams,
}: {
  searchParams: { order_id: string };
}) {
  const session = await auth();
  if (!session?.user) {
    redirect('/auth/signin');
  }

  const orderId = searchParams.order_id;
  if (!orderId) {
    redirect('/profile/orders');
  }

  // Fetch order details
  const orderResult = await db.select()
    .from(order)
    .where(eq(order.id, orderId))
    .limit(1);

  if (!orderResult.length) {
    redirect('/profile/orders');
  }

  const orderData = orderResult[0];

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-center mb-6">
          <XCircle className="h-16 w-16 text-red-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-4">Payment Cancelled</h1>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            Your payment process was cancelled. No charges have been made.
          </p>
          
          <div className="border-t border-gray-200 pt-4">
            <h2 className="font-semibold text-lg mb-2">Order Details</h2>
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-medium">{orderData.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium">
                ${parseFloat(orderData.total_price.toString()).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="font-medium text-yellow-500">
                {orderData.orderStatus}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 space-y-4">
          <Link href={`/profile/place-order/checkout?order_id=${orderId}`}>
            <Button className="w-full">
              Try Payment Again
            </Button>
          </Link>
          
          <Link href="/profile/orders">
            <Button variant="outline" className="w-full">
              View Your Orders
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 