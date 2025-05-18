'use client';

import { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { useRouter } from 'next/navigation';

interface CheckoutButtonProps {
	orderId: string;
	className?: string;
}

export function CheckoutButton({
	orderId,
	className = '',
}: CheckoutButtonProps) {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleCheckout = async () => {
		setIsLoading(true);

		try {
			const response = await fetch('/api/checkout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ orderId }),
			});

			const data = await response.json();

			if (data.url) {
				// Redirect to Stripe Checkout
				window.location.href = data.url;
			} else {
				throw new Error(data.error || 'Failed to create checkout session');
			}
		} catch (error) {
			console.error('Checkout error:', error);
			setIsLoading(false);
		}
	};

	return (
		<Button
			onClick={handleCheckout}
			disabled={isLoading}
			className={`w-full ${className}`}>
			{isLoading ? 'Processing...' : 'Proceed to Payment'}
		</Button>
	);
}
