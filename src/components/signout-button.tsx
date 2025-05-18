'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/src/components/ui/button';

export const SignoutButton = () => {
	return (
		<Button
			variant='ghost'
			size='sm'
			className='text-gray-700 hover:text-red-600'
			onClick={() => signOut({ callbackUrl: '/auth/signin' })}>
			Sign Out
		</Button>
	);
};
