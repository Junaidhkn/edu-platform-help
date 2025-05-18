'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/src/components/ui/button';
import { Textarea } from '@/src/components/ui/textarea';
import { Input } from '@/src/components/ui/input';
import { ArrowLeft, Mail, Loader2 } from 'lucide-react';
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
	subject: z.string().min(5, {
		message: 'Subject must be at least 5 characters.',
	}),
	message: z.string().min(10, {
		message: 'Message must be at least 10 characters.',
	}),
});

type FormValues = z.infer<typeof formSchema>;

interface ContactCustomerFormProps {
	orderId: string;
	userEmail: string;
	userName: string;
	orderSubject: string;
}

export default function ContactCustomerForm({
	orderId,
	userEmail,
	userName,
	orderSubject,
}: ContactCustomerFormProps) {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			subject: `Order #${orderId.slice(-6)} - ${orderSubject}`,
			message: `Dear ${userName},\n\nRegarding your order #${orderId.slice(
				-6,
			)}:\n\n`,
		},
	});

	const onSubmit = async (data: FormValues) => {
		setIsSubmitting(true);

		try {
			// Call API to send email
			const response = await fetch(`/api/orders/${orderId}/contact`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					subject: data.subject,
					message: data.message,
					email: userEmail,
					name: userName,
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || 'Failed to send email');
			}

			toast.success('Email sent successfully');
			router.push(`/dashboard/orders/${orderId}`);
		} catch (error) {
			console.error('Error sending email:', error);
			toast.error(
				error instanceof Error ? error.message : 'Failed to send email',
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
				<div className='bg-blue-50 p-4 rounded-md border border-blue-200 mb-4'>
					<div className='flex items-center'>
						<Mail className='h-5 w-5 text-blue-600 mr-2' />
						<p className='text-blue-700 font-medium'>
							Sending email to {userEmail}
						</p>
					</div>
					<p className='text-blue-600 text-sm mt-1'>
						Use this form to communicate with the customer about their order.
					</p>
				</div>

				<FormField
					control={form.control}
					name='subject'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email Subject</FormLabel>
							<FormControl>
								<Input
									placeholder='Enter email subject'
									{...field}
								/>
							</FormControl>
							<FormDescription>
								This will be the subject line of the email.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='message'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email Message</FormLabel>
							<FormControl>
								<Textarea
									placeholder='Enter your message to the customer'
									className='min-h-[200px]'
									{...field}
								/>
							</FormControl>
							<FormDescription>
								Enter the detailed message to send to the customer.
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
						disabled={isSubmitting}>
						{isSubmitting ? (
							<>
								<Loader2 className='mr-2 h-4 w-4 animate-spin' />
								Sending...
							</>
						) : (
							<>
								<Mail className='mr-2 h-4 w-4' />
								Send Email
							</>
						)}
					</Button>
				</div>
			</form>
		</Form>
	);
}
