'use client';

import { useForm } from 'react-hook-form';
import { valibotResolver } from '@hookform/resolvers/valibot';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { type SigninInput, SigninSchema } from '@/validators/signin-validator';
import { signinUserAction } from '@/actions/signin-user-action';
import { useState } from 'react';

export const SigninForm = () => {
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<SigninInput>({
		resolver: valibotResolver(SigninSchema),
		defaultValues: { email: '', password: '' },
	});

	const { handleSubmit, control, formState, setError } = form;

	const submit = async (values: SigninInput) => {
		setIsLoading(true);
		try {
			const res = await signinUserAction(values);

			if (res.success) {
				// Check if the user is a freelancer
				const userResponse = await fetch('/api/auth/session');
				const userData = await userResponse.json();

				if ((userData?.user as any)?.isFreelancer) {
					window.location.href = '/freelancer/orders';
				} else {
					window.location.href = '/profile';
				}
			} else {
				switch (res.statusCode) {
					case 401:
						setError('password', { message: res.error });
						break;
					case 500:
					default:
						const error = res.error || 'Internal Server Error';
						setError('password', { message: error });
				}
			}
		} catch (error) {
			setError('password', { message: 'An unexpected error occurred' });
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={handleSubmit(submit)}
				className='space-y-5 w-full'
				autoComplete='off'>
				<FormField
					control={control}
					name='email'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='text-gray-700'>Email</FormLabel>
							<FormControl>
								<Input
									type='email'
									placeholder='youremail@example.com'
									className='focus:ring-purple-500 focus:border-purple-500'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={control}
					name='password'
					render={({ field }) => (
						<FormItem>
							<div className='flex justify-between items-center'>
								<FormLabel className='text-gray-700'>Password</FormLabel>
								<Button
									type='button'
									variant='link'
									size='sm'
									className='h-auto p-0 text-xs font-normal'>
									Forgot password?
								</Button>
							</div>
							<FormControl>
								<Input
									type='password'
									placeholder='••••••••'
									className='focus:ring-purple-500 focus:border-purple-500'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					type='submit'
					disabled={formState.isSubmitting || isLoading}
					className='w-full bg-purple-600 hover:bg-purple-700 text-white py-2 mt-6'>
					{isLoading ? 'Signing in...' : 'Sign in'}
				</Button>
			</form>
		</Form>
	);
};
