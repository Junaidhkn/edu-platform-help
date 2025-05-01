import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { auth } from '@/auth';
import db from '@/src/db';
import { orders, review } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import ReviewFormWrapper from '@/components/ReviewFormWrapper';

interface OrderReviewPageProps {
	params: {
		id: string;
	};
}

export const metadata = {
	title: 'Review Order',
	description: 'Leave a review for your completed order',
};

export default async function OrderReviewPage({
	params,
}: OrderReviewPageProps) {
	const session = await auth();

	if (!session?.user) {
		redirect('/auth/signin');
	}

	const userId = session.user.id;

	// Fetch order with freelancer information
	const orderData = await db.query.orders.findFirst({
		where: eq(orders.id, params.id),
		with: {
			freelancer: true,
		},
	});

	// If order not found or doesn't belong to this user, return 404
	if (!orderData || orderData.userId !== userId) {
		notFound();
	}

	// Check if order is completed and has a freelancer assigned
	if (orderData.orderStatus !== 'completed' || !orderData.freelancerId) {
		redirect(`/profile/orders/${params.id}`);
	}

	// Check if a review already exists
	const existingReview = await db.query.review.findFirst({
		where: eq(review.orderId, params.id),
	});

	if (existingReview) {
		redirect(`/profile/orders/${params.id}`);
	}

	return (
		<div className='container mx-auto py-10'>
			<div className='flex flex-col gap-6 max-w-3xl mx-auto'>
				<div className='flex items-center'>
					<Link href={`/profile/orders/${params.id}`}>
						<Button
							variant='ghost'
							className='mr-4'>
							<ChevronLeft className='h-4 w-4 mr-1' />
							Back to Order
						</Button>
					</Link>
					<h1 className='text-2xl font-bold'>Review Your Order</h1>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Leave a Review</CardTitle>
						<CardDescription>
							Share your experience with the freelancer who completed your
							order.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className='mb-6'>
							<h3 className='text-sm font-medium text-gray-500'>
								Order Information
							</h3>
							<p className='mt-1 text-sm'>
								<span className='font-medium'>Order ID:</span>{' '}
								{orderData.id.substring(0, 8)}...
							</p>
							<p className='mt-1 text-sm'>
								<span className='font-medium'>Subject:</span>{' '}
								{orderData.subjectCategory}
							</p>
							<p className='mt-1 text-sm'>
								<span className='font-medium'>Type:</span>{' '}
								{orderData.typeCategory}
							</p>
						</div>

						<ReviewFormWrapper
							orderId={params.id}
							freelancerId={orderData.freelancerId}
							freelancerName={
								orderData.freelancer?.firstName || 'the freelancer'
							}
						/>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
