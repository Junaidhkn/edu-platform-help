'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Loader2 } from 'lucide-react';
import FreelancerTable from '@/components/admin/FreelancerTable';

interface AssignOrderPageProps {
  params: {
    id: string;
  };
}

export default function AssignOrderPage({ params }: AssignOrderPageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [freelancers, setFreelancers] = useState([]);
  const [order, setOrder] = useState(null);

  // Check auth
  useEffect(() => {
    const checkAuth = async () => {
      const session = await auth();
      if (!session?.user || session.user.role !== 'admin') {
        redirect('/');
      }
      
      // Fetch order details
      try {
        const orderResponse = await fetch(`/api/orders/${params.id}`);
        if (!orderResponse.ok) {
          throw new Error('Failed to fetch order');
        }
        const orderData = await orderResponse.json();
        setOrder(orderData);
        
        // Only fetch freelancers if order is accepted
        if (orderData.orderStatus === 'accepted') {
          const freelancersResponse = await fetch('/api/freelancers');
          if (!freelancersResponse.ok) {
            throw new Error('Failed to fetch freelancers');
          }
          const freelancersData = await freelancersResponse.json();
          setFreelancers(freelancersData);
        } else {
          toast.error('Order must be accepted before assigning to a freelancer');
          router.push(`/dashboard/orders/${params.id}`);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error loading data');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [params.id, router]);

  const handleAssignOrder = async (freelancerId: string) => {
    try {
      const response = await fetch('/api/orders/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: params.id,
          freelancerId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to assign order');
      }

      toast.success('Order assigned successfully');
      router.push(`/dashboard/orders/${params.id}`);
    } catch (error) {
      console.error('Error assigning order:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to assign order');
    }
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
      <div className="flex flex-col gap-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => router.push(`/dashboard/orders/${params.id}`)}
            className="mr-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Order
          </Button>
          <h1 className="text-2xl font-bold">Assign Order to Freelancer</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Order #{params.id.substring(0, 8)}</CardTitle>
            <CardDescription>
              Select a freelancer to assign this order
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FreelancerTable 
              freelancers={freelancers} 
              onAssignOrder={handleAssignOrder}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 