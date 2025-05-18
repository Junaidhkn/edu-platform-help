'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/src/components/ui/card';

export default function CheckoutCancelPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const orderId = searchParams.get('order_id');

	useEffect(() => {
		// Redirect after 5 seconds
		const redirectTimer = setTimeout(() => {
			router.push(orderId ? `/profile/orders/${orderId}` : '/profile/orders');
		}, 5000);

		return () => clearTimeout(redirectTimer);
	}, [orderId, router]);

	return (
		<div className='container mx-auto max-w-lg py-20'>
			<Card className='border-red-100'>
				<CardHeader className='text-center'>
					<div className='mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-50'>
						<XCircle className='h-10 w-10 text-red-500' />
					</div>
					<CardTitle className='text-2xl'>Payment Cancelled</CardTitle>
					<CardDescription>
						Your payment was cancelled. Don't worry, your order is still saved.
					</CardDescription>
				</CardHeader>
				<CardContent className='text-center'>
					<p className='text-gray-500'>
						You can try again by returning to your order or continue browsing.
					</p>
					<p className='mt-1 text-gray-500'>
						You will be redirected to {orderId ? 'your order' : 'orders page'}{' '}
						in 5 seconds.
					</p>
				</CardContent>
				<CardFooter className='flex justify-center gap-4'>
					{orderId ? (
						<Link href={`/profile/orders/${orderId}`}>
							<Button variant='default'>Return to Order</Button>
						</Link>
					) : null}
					<Link href='/profile/orders'>
						<Button variant={orderId ? 'outline' : 'default'}>
							View All Orders
						</Button>
					</Link>
				</CardFooter>
			</Card>
		</div>
	);
}
