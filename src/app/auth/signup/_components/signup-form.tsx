'use client';

import { type SignupInput, SignupSchema } from '@/validators/signup-validator';
import { useForm } from 'react-hook-form';
import { valibotResolver } from '@hookform/resolvers/valibot';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { signupUserAction } from '@/src/actions/signup-user-action';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export const SignupForm = () => {
	const [success, setSuccess] = useState(false);
	const router = useRouter();

	const form = useForm<SignupInput>({
		resolver: valibotResolver(SignupSchema),
		defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
	});

	const { handleSubmit, control, formState, setError } = form;

	const submit = async (values: SignupInput) => {
		const res = await signupUserAction(values);

		if (res.success) {
			router.push('/auth/signup/success');
		} else {
			switch (res.statusCode) {
				case 400:
					const nestedErrors = res.error.nested;

					for (const key in nestedErrors) {
						setError(key as keyof SignupInput, {
							message: nestedErrors[key]?.[0],
						});
					}
					break;
				case 500:
				default:
					const error = res.error || 'Internal Server Error';
					setError('confirmPassword', { message: error });
			}
		}
	};

	if (success) {
		return (
			<div>
				<p>User successfully created!</p>

				<span>
					Click{' '}
					<Button
						variant='link'
						size='sm'
						className='px-0'
						asChild>
						<Link href='/auth/signin'>here</Link>
					</Button>{' '}
					to sign in.
				</span>
			</div>
		);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={handleSubmit(submit)}
				className='space-y-5 w-full'
				autoComplete='off'>
				<FormField
					control={control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='text-gray-700'>Name</FormLabel>
							<FormControl>
								<Input
									type='text'
									placeholder='Your full name'
									className='focus:ring-purple-500 focus:border-purple-500'
									{...field}
								/>
							</FormControl>
							<FormDescription className='text-xs'>Optional</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

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
							<FormLabel className='text-gray-700'>Password</FormLabel>
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

				<FormField
					control={control}
					name='confirmPassword'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='text-gray-700'>Confirm Password</FormLabel>
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
					disabled={formState.isSubmitting}
					className='w-full bg-purple-600 hover:bg-purple-700 text-white py-2 mt-6'>
					Create Account
				</Button>
			</form>
		</Form>
	);
};
