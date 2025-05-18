'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
	reviewFormSchema,
	ReviewFormValues,
} from '@/src/lib/validators/review-schema';
import { Button } from '@/src/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/src/components/ui/form';
import { Textarea } from '@/src/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { StarRating } from '@/src/components/StarRating';

interface ReviewFormProps {
	orderId: string;
	freelancerId: string;
	freelancerName: string;
	onSuccess?: () => void;
}

export function ReviewForm({
	orderId,
	freelancerId,
	freelancerName,
	onSuccess,
}: ReviewFormProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();

	const form = useForm<ReviewFormValues>({
		resolver: zodResolver(reviewFormSchema),
		defaultValues: {
			orderId,
			freelancerId,
			rating: 5,
			reviewText: '',
		},
	});

	const onSubmit = async (data: ReviewFormValues) => {
		try {
			setIsSubmitting(true);

			const response = await fetch('/api/reviews', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to submit review');
			}

			toast.success('Review submitted successfully');

			if (onSuccess) {
				onSuccess();
			} else {
				router.refresh();
			}
		} catch (error) {
			console.error('Error submitting review:', error);
			toast.error(error instanceof Error ? error.message : 'An error occurred');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-6'>
				<div className='space-y-2'>
					<h3 className='text-lg font-medium'>
						Rate {freelancerName}&apos;s Work
					</h3>
					<p className='text-sm text-gray-500'>
						Share your experience with this freelancer to help others make
						informed decisions.
					</p>
				</div>

				<FormField
					control={form.control}
					name='rating'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Rating</FormLabel>
							<FormControl>
								<StarRating
									rating={field.value}
									onRatingChange={(newRating) => field.onChange(newRating)}
									maxRating={5}
								/>
							</FormControl>
							<FormDescription>
								Rate the freelancer&apos;s work from 1 to 5 stars
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='reviewText'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Your Review</FormLabel>
							<FormControl>
								<Textarea
									placeholder='Share details of your experience with this freelancer...'
									rows={5}
									{...field}
								/>
							</FormControl>
							<FormDescription>
								Your honest feedback helps improve our service
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					type='submit'
					disabled={isSubmitting}
					className='w-full'>
					{isSubmitting ? (
						<>
							<Loader2 className='mr-2 h-4 w-4 animate-spin' />
							Submitting Review...
						</>
					) : (
						'Submit Review'
					)}
				</Button>
			</form>
		</Form>
	);
}
