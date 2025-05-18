'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/src/components/ui/form';
import { toast } from 'sonner';

const formSchema = z.object({
	id: z
		.string()
		.min(1, {
			message: 'ID must be at least 1 character.',
		})
		.regex(/^[a-z0-9-]+$/, {
			message: 'ID must contain only lowercase letters, numbers, and hyphens.',
		}),
	name: z.string().min(3, {
		message: 'Name must be at least 3 characters.',
	}),
	priceModifier: z.coerce
		.number()
		.min(0.1, {
			message: 'Price modifier must be at least 0.1.',
		})
		.max(5, {
			message: 'Price modifier must be at most 5.',
		}),
});

type FormValues = z.infer<typeof formSchema>;

export function NewCategoryForm() {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: '',
			name: '',
			priceModifier: 1.0,
		},
	});

	const onSubmit = async (data: FormValues) => {
		setIsSubmitting(true);
		try {
			const response = await fetch('/api/services/categories', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to create category');
			}

			toast.success('Category created successfully');
			router.push('/dashboard/services');
			router.refresh();
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : 'Error creating category',
			);
			console.error('Error creating category:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-6'>
				<FormField
					control={form.control}
					name='id'
					render={({ field }) => (
						<FormItem>
							<FormLabel>ID</FormLabel>
							<FormControl>
								<Input
									placeholder='e.g. computer-science'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input
									placeholder='e.g. Computer Science'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='priceModifier'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Price Modifier</FormLabel>
							<FormControl>
								<div className='flex items-center'>
									<Input
										type='number'
										step='0.05'
										min='0.1'
										max='5'
										className='w-32'
										{...field}
									/>
									<span className='ml-2'>× base price</span>
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className='flex justify-end space-x-2'>
					<Button
						type='button'
						variant='outline'
						onClick={() => router.push('/dashboard/services')}>
						Cancel
					</Button>
					<Button
						type='submit'
						disabled={isSubmitting}>
						{isSubmitting ? 'Creating...' : 'Create Category'}
					</Button>
				</div>
			</form>
		</Form>
	);
}
