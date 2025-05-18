'use client';

import { useFormState } from 'react-dom';
import { Input } from '@/src/components/ui/input';
import { signinUser } from '@/actions/auth';
import Link from 'next/link';
import Submit from './SubmitButton';

const initState = { message: null };

const SigninForm = () => {
	const [formState, action] = useFormState<{ message: string | null }>(
		signinUser,
		initState,
	);

	return (
		<form
			action={action}
			className='bg-content1 border border-default-100 shadow-lg rounded-md p-3 flex flex-col gap-2 '>
			<h3 className='my-4'>Sign in</h3>
			<Input
				required
				placeholder='Email'
				name='email'
				type='email'
			/>
			<Input
				name='password'
				required
				type='password'
				placeholder='Password'
			/>
			<Submit label={'signin'} />
			<div>
				<Link href='/signup'>{`Don't have an account?`}</Link>
			</div>
			{formState?.message && <p>{formState.message}</p>}
		</form>
	);
};

export default SigninForm;
