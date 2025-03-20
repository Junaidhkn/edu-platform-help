import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import db from '@/src/db';
import order from '@/src/db/schema/order';
import { eq } from 'drizzle-orm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default async function OrderCheckoutPage({
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
  
  // If order is already paid, redirect to orders page
  if (orderData.isPaid) {
    redirect('/profile/orders');
  }

  return (
    <div className="container max-w-4xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Complete Your Order</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
          <CardDescription>Review your order details before payment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-medium">{orderData.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{new Date(orderData.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-medium">{orderData.typeCategory}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Subject</p>
                <p className="font-medium">{orderData.subjectCategory}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Pages</p>
                <p className="font-medium">{orderData.pages}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Word Count</p>
                <p className="font-medium">{orderData.wordCount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Academic Level</p>
                <p className="font-medium">{orderData.academicLevel}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Deadline</p>
                <p className="font-medium">{new Date(orderData.deadline).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-gray-500">Description</p>
              <p className="text-sm mt-1">{orderData.description}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col space-y-4">
          <div className="w-full flex justify-between items-center border-t pt-4">
            <span className="text-lg font-semibold">Total Amount:</span>
            <span className="text-xl font-bold">${parseFloat(orderData.total_price.toString()).toFixed(2)}</span>
          </div>
          <form action={`/api/checkout?orderId=${orderId}`} method="POST">
            <Button type="submit" className="w-full">
              Proceed to Payment
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
} 