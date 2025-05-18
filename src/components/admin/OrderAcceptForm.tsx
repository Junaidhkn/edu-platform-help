'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/src/components/ui/button';
import { Textarea } from '@/src/components/ui/textarea';
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/src/components/ui/form';
import { toast } from 'sonner';

// Form validation schema
const formSchema = z.object({
	message: z.string().min(10, 'Message must be at least 10 characters long'),
});

type FormValues = z.infer<typeof formSchema>;

interface OrderAcceptFormProps {
	orderId: string;
	userEmail: string;
	userName: string;
}

export default function OrderAcceptForm({
	orderId,
	userEmail,
	userName,
}: OrderAcceptFormProps) {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			message: `Dear ${userName},\n\nWe're pleased to inform you that your order #${orderId.slice(
				-6,
			)} has been accepted. Our team will start working on your assignment immediately.\n\nWe'll keep you updated on the progress and deliver your work before the deadline.\n\nThank you for choosing our service.\n\nBest regards,\nThe Support Team`,
		},
	});

	const onSubmit = async (data: FormValues) => {
		setIsSubmitting(true);

		try {
			// Call API to update order status and send email
			const response = await fetch(`/api/orders/${orderId}/update-status`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					status: 'accepted',
					message: data.message,
					email: userEmail,
					name: userName,
				}),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message || 'Failed to update order status');
			}

			// Check if email was sent successfully
			if (result.emailSent) {
				toast.success('Order accepted successfully and email sent to customer');
			} else {
				toast.warning(
					'Order accepted but email could not be sent. Please try sending the email again later.',
				);
			}

			router.push(`/dashboard/orders/${orderId}`);
			router.refresh();
		} catch (error) {
			console.error('Error accepting order:', error);
			toast.error(
				error instanceof Error ? error.message : 'Failed to accept order',
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-6'>
				<div className='bg-green-50 p-4 rounded-md border border-green-200 mb-4'>
					<div className='flex items-center'>
						<CheckCircle className='h-5 w-5 text-green-600 mr-2' />
						<p className='text-green-700 font-medium'>
							You are about to accept this order
						</p>
					</div>
					<p className='text-green-600 text-sm mt-1'>
						The customer will be notified via email with your message.
					</p>
				</div>

				<FormField
					control={form.control}
					name='message'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Notification Message</FormLabel>
							<FormControl>
								<Textarea
									placeholder='Enter message to the customer'
									className='min-h-[200px]'
									{...field}
								/>
							</FormControl>
							<FormDescription>
								This message will be sent to the customer via email.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className='flex justify-between'>
					<Link href={`/dashboard/orders/${orderId}`}>
						<Button
							type='button'
							variant='outline'>
							<ArrowLeft className='mr-2 h-4 w-4' /> Back to Order
						</Button>
					</Link>

					<Button
						type='submit'
						disabled={isSubmitting}
						className='bg-green-600 hover:bg-green-700 text-white'>
						{isSubmitting ? (
							<>
								<Loader2 className='mr-2 h-4 w-4 animate-spin' />
								Processing...
							</>
						) : (
							<>
								<CheckCircle className='mr-2 h-4 w-4' />
								Accept Order
							</>
						)}
					</Button>
				</div>
			</form>
		</Form>
	);
}
