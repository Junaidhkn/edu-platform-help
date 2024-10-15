'use client';

import { registerUser } from '@/actions/auth';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useFormState } from 'react-dom';
import Submit from './SubmitButton';

const initialState = { message: null };

const SignupForm = () => {
	const [formState, action] = useFormState<{ message: string | null }>(
		registerUser,
		initialState,
	);
	return (
		<form
			action={action}
			className='bg-content1 border border-default-100 shadow-lg rounded-md p-3 flex flex-col gap-2 '>
			<h3 className='my-4'>Sign up</h3>
			<Input
				placeholder='Email'
				name='email'
				required
			/>
			<Input
				name='password'
				type='password'
				placeholder='Password'
				required
			/>
			<Submit label={'Sign Up'} />

			<div>
				<Link href='/signin'>{`Already have an account?`}</Link>
			</div>
			{formState?.message && <p>{formState.message}</p>}
		</form>
	);
};

export default SignupForm;