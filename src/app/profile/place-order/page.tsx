'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { OrderForm } from '@/components/form/order-form';
import { OrderFormValues } from '@/validators/order-form-schema';

export default function PlaceOrderPage() {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Handle form submission
	const handleSubmit = async (values: OrderFormValues) => {
		try {
			setIsSubmitting(true);

			// Format deadline for API
			const submissionValues = {
				...values,
				deadline: values.deadline.toISOString(),
				pages: Math.ceil(values.wordCount / 250),
			};

			// Create the order
			const response = await fetch('/api/orders/create', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(submissionValues),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to create order');
			}

			const data = await response.json();
			console.log('Order created successfully:', data);

			// Redirect to checkout with the order ID
			router.push(`/api/checkout?orderId=${data.orderId}`);
		} catch (error) {
			console.error('Error creating order:', error);
			throw error;
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className='mx-auto max-w-4xl px-4 py-12'>
			<div className='mb-8'>
				<h1 className='text-3xl font-bold'>Place New Order</h1>
				<p className='mt-2 text-muted-foreground'>
					Fill out the form below to place a new academic assignment order.
				</p>
			</div>

			<div className='rounded-lg border bg-card p-6 shadow-sm'>
				<OrderForm onSubmit={handleSubmit} />
			</div>
		</div>
	);
}
