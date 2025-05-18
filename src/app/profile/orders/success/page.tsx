'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/src/components/ui/card';

export default function CheckoutSuccessPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const sessionId = searchParams.get('session_id');
	const [orderId, setOrderId] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isVerifying, setIsVerifying] = useState(true);

	useEffect(() => {
		if (!sessionId) {
			router.push('/profile');
			return;
		}

		// Verify payment with backend
		const verifyPayment = async () => {
			try {
				setIsVerifying(true);
				const response = await fetch(
					`/api/verify-payment?session_id=${sessionId}`,
				);

				if (!response.ok) {
					throw new Error('Failed to verify payment');
				}

				const data = await response.json();

				if (data.success) {
					setOrderId(data.orderId);
				} else {
					setError('Payment verification failed. Please contact support.');
				}
			} catch (error) {
				console.error('Error verifying payment:', error);
				setError('Failed to verify payment status. Please contact support.');
			} finally {
				setIsVerifying(false);
			}
		};

		verifyPayment();

		// Redirect after 10 seconds if no error
		const redirectTimer = setTimeout(() => {
			if (!error) {
				router.push('/profile');
			}
		}, 10000);

		return () => clearTimeout(redirectTimer);
	}, [sessionId, router, error]);

	return (
		<div className='container mx-auto max-w-lg py-20'>
			<Card className={`border-${error ? 'red' : 'green'}-100`}>
				<CardHeader className='text-center'>
					<div
						className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-${
							error ? 'red' : 'green'
						}-50`}>
						{error ? (
							<AlertCircle className='h-10 w-10 text-red-500' />
						) : (
							<CheckCircle className='h-10 w-10 text-green-500' />
						)}
					</div>
					<CardTitle className='text-2xl'>
						{error ? 'Payment Verification Failed' : 'Payment Successful!'}
					</CardTitle>
					<CardDescription>
						{error
							? 'There was an issue verifying your payment. Please contact support.'
							: 'Thank you for your order. We&apos;ve received your payment and will start working on your assignment.'}
					</CardDescription>
				</CardHeader>
				<CardContent className='text-center'>
					{isVerifying ? (
						<p className='text-gray-500'>Verifying your payment...</p>
					) : error ? (
						<p className='text-red-500'>{error}</p>
					) : (
						<>
							<p className='text-gray-500'>
								{orderId ? (
									<>
										Your order ID is{' '}
										<span className='font-medium text-black'>{orderId}</span>
									</>
								) : (
									<>Your payment has been processed successfully.</>
								)}
							</p>
							<p className='mt-1 text-gray-500'>
								You will be redirected to your orders page in 10 seconds.
							</p>
						</>
					)}
				</CardContent>
				<CardFooter className='flex justify-center'>
					<Link href='/profile'>
						<Button>View My Orders</Button>
					</Link>
				</CardFooter>
			</Card>
		</div>
	);
}
