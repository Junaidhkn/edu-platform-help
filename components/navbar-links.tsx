'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SignoutButton } from '@/components/signout-button';
import { useSession } from 'next-auth/react';
import { Loader2Icon } from 'lucide-react';

export const NavbarLinks = () => {
	const session = useSession();

	return (
		<>
			<li className='hidden md:block'>
				<Link
					href='/services'
					className='text-gray-700 hover:text-purple-700 font-medium'>
					Services
				</Link>
			</li>
			<li className='hidden md:block'>
				<Link
					href='/#how-it-works'
					className='text-gray-700 hover:text-purple-700 font-medium'>
					How It Works
				</Link>
			</li>

			{session.status === 'loading' ? (
				<Loading />
			) : session.status === 'authenticated' ? (
				<SignedIn />
			) : (
				<SignedOut />
			)}
		</>
	);
};

const Loading = () => {
	return (
		<li>
			<Button
				size='sm'
				variant='ghost'>
				<Loader2Icon className='min-w-[8ch] animate-spin' />
			</Button>
		</li>
	);
};

const SignedIn = () => {
	return (
		<>
			<li>
				<Button
					size='sm'
					variant='ghost'
					className='text-gray-700'
					asChild>
					<Link href='/dashboard'>Dashboard</Link>
				</Button>
			</li>
			<li>
				<Button
					size='sm'
					className='bg-purple-600 hover:bg-purple-700'
					asChild>
					<Link href='/profile'>Profile</Link>
				</Button>
			</li>
			<li>
				<SignoutButton />
			</li>
		</>
	);
};

const SignedOut = () => {
	return (
		<>
			<li>
				<Button
					variant='ghost'
					size='sm'
					className='text-gray-700'
					asChild>
					<Link href='/auth/signin'>Sign In</Link>
				</Button>
			</li>
			<li>
				<Button
					size='sm'
					className='bg-transparent border-2 border-white hover:bg-slate-700 hover:bg-opacity-10 rounded-lg px-2 py-2 text-center'
					asChild>
					<Link href='/auth/signup'>Sign Up</Link>
				</Button>
			</li>
		</>
	);
};
