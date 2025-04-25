"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription,CardHeader, CardTitle } from '@/components/ui/card';

import { Suspense } from 'react';
import { notFound, redirect } from 'next/navigation';
import { and, eq } from 'drizzle-orm';

import { auth } from '@/auth';
import db from '@/src/db';
import {  orders } from '@/src/db/schema';
import {  freelancers } from '@/src/db/schema';
import { submissions } from '@/src/db/schema';

import SubmissionUploader from '@/components/freelancer/submission-uploader';
import SubmissionHistory from '@/components/freelancer/submission-history';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

async function getOrderDetails(orderId: string, freelancerId: string) {
  // Get the order details
  const orderDetails = await db
    .select({
      id: orders.id,
      title: orders.subjectCategory,
      description: orders.description,
      deadline: orders.deadline,
      status: orders.orderStatus,
    })
    .from(orders)
    .where(eq(orders.id, orderId))
    .execute();

  if (!orderDetails.length) {
    return null;
  }

  // Get previous submissions
  const previousSubmissions = await db
    .select()
    .from(submissions)
    .where(
      and(
        eq(submissions.orderId, orderId),
        eq(submissions.freelancerId, freelancerId)
      )
    )
    .orderBy(submissions.createdAt)
    .execute();

  return {
    order: orderDetails[0],
    submissions: previousSubmissions,
  };
}

export default async function SubmitWorkPage({ params }: { params: { id: string } }) {
  const session = await auth();
  
  if (!session || !session.user) {
    redirect('/auth/signin?callbackUrl=/freelancer/orders');
  }
  
  // Get freelancer ID
  const freelancerData = await db
    .select({ id: freelancers.id })
    .from(freelancers)
    .where(eq(freelancers.email, session.user.email as string))
    .execute();

  if (!freelancerData.length) {
    redirect('/freelancer');
  }

  const freelancerId = freelancerData[0].id;
  
  const orderData = await getOrderDetails(params.id, freelancerId);
  
  if (!orderData) {
    return notFound();
  }

  const { order, submissions } = orderData;

  // Check if order is completed
  if (order.status === 'completed') {
    redirect(`/freelancer/orders/${params.id}`);
  }

  return (
    <div className="container max-w-5xl py-8 space-y-8">
      <Link href={`/freelancer/orders/${params.id}`}>
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Order
        </Button>
      </Link>
      
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
              <CardDescription>
                Review the order details before submitting your work
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Title</h3>
                  <p>{order.title}</p>
                </div>
                <div>
                  <h3 className="font-medium">Description</h3>
                  <p className="whitespace-pre-wrap">{order.description}</p>
                </div>
                <div>
                  <h3 className="font-medium">Deadline</h3>
                  <p>{new Date(order.deadline).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="font-medium">Status</h3>
                  <p className="capitalize">{order.status}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-8">
          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <SubmissionUploader 
              orderId={params.id} 
              onSuccess={() => {
                // This will be handled client-side
              }} 
            />
          </Suspense>
        </div>
      </div>
      
      {submissions.length > 0 && (
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Submission History</CardTitle>
              <CardDescription>
                Previous submissions for this order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Skeleton className="h-[200px] w-full" />}>
                <SubmissionHistory submissions={submissions} />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 