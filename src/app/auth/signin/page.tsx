import { Button } from '@/components/ui/button';
import { SigninForm } from './_components/signin-form';
import Link from 'next/link';
import {
	OAuthSigninButtons,
	OAuthSigninButtonsSkeleton,
} from '@/components/oauth-signin-buttons';
import { Suspense } from 'react';
import { ForgotPasswordForm } from './_components/forgot-password-form';

export default function SigninPage() {
	return (
		<>
			<div className='text-center mb-6'>
				<h1 className='text-2xl font-bold tracking-tight'>
					Sign In to Top Nerd
				</h1>
				<p className='text-sm text-gray-600 mt-2'>
					Enter your credentials to access your account
				</p>
			</div>

			{/* Signin Form */}
			<SigninForm />

			{/* OAuth Links */}
			<div className='relative my-6'>
				<div className='absolute inset-0 flex items-center'>
					<div className='w-full border-t border-gray-200'></div>
				</div>
				<div className='relative flex justify-center text-sm'>
					<span className='px-2 bg-white text-gray-500'>Or continue with</span>
				</div>
			</div>

			<Suspense fallback={<OAuthSigninButtonsSkeleton />}>
				<OAuthSigninButtons />
			</Suspense>

			{/* Go to Signup Link */}
			<div className='mt-6 text-center text-sm'>
				<p>
					Don&apos;t have an account?{' '}
					<Button
						variant='link'
						size='sm'
						className='px-1'
						asChild>
						<Link href='/auth/signup'>Sign up</Link>
					</Button>
				</p>
			</div>

			{/* Forgot Password Dialog */}
			<ForgotPasswordForm />
		</>
	);
}
