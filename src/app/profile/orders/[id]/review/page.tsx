'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { toast } from 'sonner';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ReviewForm } from '@/components/ReviewForm';

interface OrderReviewPageProps {
  params: {
    id: string;
  };
}

export default function OrderReviewPage({ params }: OrderReviewPageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const session = await auth();
      if (!session?.user) {
        router.push('/login');
        return;
      }

      try {
        // Fetch order details
        const response = await fetch(`/api/orders/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch order');
        }
        
        const orderData = await response.json();
        
        // Check if the order belongs to the user
        if (orderData.userId !== session.user.id) {
          toast.error('You do not have permission to review this order');
          router.push('/profile/orders');
          return;
        }
        
        // Check if the order is completed and has a freelancer assigned
        if (orderData.orderStatus !== 'completed' || !orderData.freelancerId) {
          toast.error('This order is not eligible for review');
          router.push(`/profile/orders/${params.id}`);
          return;
        }
        
        // Check if a review already exists
        const reviewResponse = await fetch(`/api/reviews?orderId=${params.id}`);
        const reviewData = await reviewResponse.json();
        
        if (reviewData.length > 0) {
          toast.error('You have already reviewed this order');
          router.push(`/profile/orders/${params.id}`);
          return;
        }
        
        setOrder(orderData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching order:', error);
        toast.error('Failed to load order details');
        router.push('/profile/orders');
      }
    };
    
    checkAuth();
  }, [params.id, router]);

  const handleReviewSuccess = () => {
    router.push(`/profile/orders/${params.id}`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        <div className="flex items-center">
          <Link href={`/profile/orders/${params.id}`}>
            <Button variant="ghost" className="mr-4">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Order
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Review Your Order</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Leave a Review</CardTitle>
            <CardDescription>
              Share your experience with the freelancer who completed your order.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500">Order Information</h3>
              <p className="mt-1 text-sm">
                <span className="font-medium">Order ID:</span> {order.id.substring(0, 8)}...
              </p>
              <p className="mt-1 text-sm">
                <span className="font-medium">Subject:</span> {order.subjectCategory}
              </p>
              <p className="mt-1 text-sm">
                <span className="font-medium">Type:</span> {order.typeCategory}
              </p>
            </div>
            
            <ReviewForm 
              orderId={params.id} 
              freelancerId={order.freelancerId}
              freelancerName={order.freelancer?.firstName || 'the freelancer'}
              onSuccess={handleReviewSuccess}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 