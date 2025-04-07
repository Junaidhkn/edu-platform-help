'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [orderId, setOrderId] = useState<string | null>(null);
  
  useEffect(() => {
    if (!sessionId) {
      router.push('/profile');
      return;
    }
    
    // Optional: Verify payment with backend
    const verifyPayment = async () => {
      try {
        const response = await fetch(`/api/verify-payment?session_id=${sessionId}`);
        if (response.ok) {
          const data = await response.json();
          setOrderId(data.orderId);
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
      }
    };
    
    // Uncomment if you implement the verification endpoint
    // verifyPayment();
    
    // For simplicity, redirect after 5 seconds
    const redirectTimer = setTimeout(() => {
      router.push('/profile');
    }, 5000);
    
    return () => clearTimeout(redirectTimer);
  }, [sessionId, router]);
  
  return (
    <div className="container mx-auto max-w-lg py-20">
      <Card className="border-green-100">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>
            Thank you for your order. We've received your payment and will start working on your assignment.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-500">
            {orderId ? (
              <>Your order ID is <span className="font-medium text-black">{orderId}</span></>
            ) : (
              <>Your payment has been processed successfully.</>
            )}
          </p>
          <p className="mt-1 text-gray-500">
            You will be redirected to your orders page in 5 seconds.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/profile">
            <Button>View My Orders</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
} 