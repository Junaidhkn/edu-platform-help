import { Button } from '@/components/ui/button';
import { SignupForm } from './_components/signup-form';
import Link from 'next/link';
import {
	OAuthSigninButtons,
	OAuthSigninButtonsSkeleton,
} from '@/components/oauth-signin-buttons';
import { Suspense } from 'react';

export default function SignupPage() {
	return (
		<>
			<div className='text-center mb-6'>
				<h1 className='text-2xl font-bold tracking-tight'>
					Create Your Account
				</h1>
				<p className='text-sm text-gray-600 mt-2'>
					Join Top Nerd and get help with your assignments
				</p>
			</div>

			{/* Signup Form */}
			<SignupForm />

			{/* OAuth Links */}
			<div className='relative my-6'>
				<div className='absolute inset-0 flex items-center'>
					<div className='w-full border-t border-gray-200'></div>
				</div>
				<div className='relative flex justify-center text-sm'>
					<span className='px-2 bg-white text-gray-500'>Or continue with</span>
				</div>
			</div>

			<Suspense fallback={<OAuthSigninButtonsSkeleton signup />}>
				<OAuthSigninButtons signup />
			</Suspense>

			{/* Go to Signin Link */}
			<div className='mt-6 text-center text-sm'>
				<p>
					Already have an account?{' '}
					<Button
						variant='link'
						size='sm'
						className='px-1'
						asChild>
						<Link href='/auth/signin'>Sign in</Link>
					</Button>
				</p>
			</div>
		</>
	);
}
