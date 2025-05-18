'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/src/components/ui/button';
import { Textarea } from '@/src/components/ui/textarea';
import { ArrowLeft, XCircle, Loader2 } from 'lucide-react';
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
	message: z.string().min(5, {
		message: 'Message must be at least 5 characters.',
	}),
	reason: z.string().min(5, {
		message: 'Reason must be at least 5 characters.',
	}),
});

type FormValues = z.infer<typeof formSchema>;

interface OrderRejectFormProps {
	orderId: string;
	userEmail: string;
	userName: string;
}

export default function OrderRejectForm({
	orderId,
	userEmail,
	userName,
}: OrderRejectFormProps) {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			message: `Dear ${userName},\n\nWe regret to inform you that we are unable to accept your order #${orderId.slice(
				-6,
			)} at this time.\n\nPlease see below for the reason why we couldn't proceed with your order.\n\nThank you for considering our service. We hope to assist you with future assignments.\n\nBest regards,\nThe Support Team`,
			reason: '',
		},
	});

	const onSubmit = async (data: FormValues) => {
		setIsSubmitting(true);

		try {
			// Combine the message with the reason
			const fullMessage = `${data.message}\n\nReason for rejection: ${data.reason}`;

			// Call API to update order status and send email
			const response = await fetch(`/api/orders/${orderId}/update-status`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					status: 'rejected',
					message: fullMessage,
					email: userEmail,
					name: userName,
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || 'Failed to update order status');
			}

			toast.success('Order rejected successfully');
			router.push(`/dashboard/orders/${orderId}`);
			router.refresh();
		} catch (error) {
			console.error('Error rejecting order:', error);
			toast.error(
				error instanceof Error ? error.message : 'Failed to reject order',
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
				<div className='bg-red-50 p-4 rounded-md border border-red-200 mb-4'>
					<div className='flex items-center'>
						<XCircle className='h-5 w-5 text-red-600 mr-2' />
						<p className='text-red-700 font-medium'>
							You are about to reject this order
						</p>
					</div>
					<p className='text-red-600 text-sm mt-1'>
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
									className='min-h-[150px]'
									{...field}
								/>
							</FormControl>
							<FormDescription>
								This is the main message that will be sent to the customer.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='reason'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Reason for Rejection</FormLabel>
							<FormControl>
								<Textarea
									placeholder='Enter the specific reason for rejecting this order'
									className='min-h-[100px]'
									{...field}
								/>
							</FormControl>
							<FormDescription>
								Provide a clear reason why the order is being rejected.
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
						className='bg-red-600 hover:bg-red-700 text-white'>
						{isSubmitting ? (
							<>
								<Loader2 className='mr-2 h-4 w-4 animate-spin' />
								Processing...
							</>
						) : (
							<>
								<XCircle className='mr-2 h-4 w-4' />
								Reject Order
							</>
						)}
					</Button>
				</div>
			</form>
		</Form>
	);
}
