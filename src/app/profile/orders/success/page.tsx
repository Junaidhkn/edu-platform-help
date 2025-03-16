import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import db from '@/src/db';
import transaction from '@/src/db/schema/transactions';
import order from '@/src/db/schema/order';
import { eq } from 'drizzle-orm';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: { session_id: string };
}) {
  const session = await auth();
  if (!session?.user) {
    redirect('/auth/signin');
  }

  const sessionId = searchParams.session_id;
  if (!sessionId) {
    redirect('/profile/orders');
  }

  // Fetch transaction
  const transactionResult = await db.select()
    .from(transaction)
    .where(eq(transaction.stripeSessionId, sessionId))
    .limit(1);

  if (!transactionResult.length) {
    redirect('/profile/orders');
  }

  const txn = transactionResult[0];

  // Fetch order details
  const orderResult = await db.select()
    .from(order)
    .where(eq(order.id, txn.orderId))
    .limit(1);

  if (!orderResult.length) {
    redirect('/profile/orders');
  }

  const orderData = orderResult[0];

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-4">Payment Successful!</h1>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            Thank you for your payment. Your order has been processed successfully.
          </p>
          
          <div className="border-t border-gray-200 pt-4">
            <h2 className="font-semibold text-lg mb-2">Order Summary</h2>
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-medium">{orderData.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium">
                ${(txn.amount / 100).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="font-medium text-green-500">
                {orderData.orderStatus}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <Link href="/profile/orders">
            <Button className="w-full">
              View Your Orders
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 