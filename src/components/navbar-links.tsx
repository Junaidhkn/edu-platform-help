'use client';

import Link from 'next/link';
import { Button } from '@/src/components/ui/button';
import { SignoutButton } from '@/src/components/signout-button';
import { useSession } from 'next-auth/react';
import { Loader2Icon } from 'lucide-react';
import { USER_ROLES } from '@/src/lib/constants';
import { useEffect, useState } from 'react';
import { checkFreelancerStatus } from '@/src/lib/freelancer';

export const NavbarLinks = ({ onClick }: { onClick?: () => void }) => {
	const session = useSession();
	const user = session.data?.user;
	const isAdmin = user?.role === USER_ROLES.ADMIN;
	const [isFreelancer, setIsFreelancer] = useState(false);

	useEffect(() => {
		const checkStatus = async () => {
			if (user?.email) {
				try {
					const isFreelancerUser = await checkFreelancerStatus(user.email);
					console.log(isFreelancerUser, 'if freelancer');
					setIsFreelancer(isFreelancerUser);
				} catch (error) {
					console.error('Error checking freelancer status:', error);
				}
			}
		};

		checkStatus();
	}, [user?.email]);

	return (
		<>
			<li className='block'>
				<Link
					href='/services'
					className='text-gray-700 hover:text-purple-700 font-medium block py-2 md:py-0'
					onClick={onClick}>
					Services
				</Link>
			</li>
			<li className='block'>
				<Link
					href='/#how-it-works'
					className='text-gray-700 hover:text-purple-700 font-medium block py-2 md:py-0'
					onClick={onClick}>
					How It Works
				</Link>
			</li>

			{session.status === 'loading' ? (
				<Loading />
			) : session.status === 'authenticated' ? (
				<SignedIn
					user={user}
					isFreelancer={isFreelancer}
					onClick={onClick}
				/>
			) : (
				<SignedOut onClick={onClick} />
			)}
		</>
	);
};

const Loading = () => {
	return (
		<li className='block'>
			<Button
				size='sm'
				variant='ghost'
				className='w-full md:w-auto'>
				<Loader2Icon className='min-w-[8ch] animate-spin' />
			</Button>
		</li>
	);
};

const SignedIn = ({
	user,
	isFreelancer,
	onClick,
}: {
	user: any;
	isFreelancer: boolean;
	onClick?: () => void;
}) => {
	const isAdmin = user?.role === USER_ROLES.ADMIN;

	return (
		<>
			{isAdmin && (
				<li className='block'>
					<Button
						size='sm'
						variant='ghost'
						className='text-gray-700 w-full md:w-auto'
						asChild>
						<Link
							href='/dashboard'
							onClick={onClick}>
							Dashboard
						</Link>
					</Button>
				</li>
			)}
			{isFreelancer ? (
				<li className='block'>
					<Button
						size='sm'
						className='bg-purple-600 hover:bg-purple-700 w-full md:w-auto'
						asChild>
						<Link
							href='/freelancer'
							onClick={onClick}>
							Dashboard
						</Link>
					</Button>
				</li>
			) : (
				<li className='block'>
					<Button
						size='sm'
						className='bg-purple-600 hover:bg-purple-700 w-full md:w-auto'
						asChild>
						<Link
							href='/profile'
							onClick={onClick}>
							Profile
						</Link>
					</Button>
				</li>
			)}
			<li className='block'>
				<SignoutButton />
			</li>
		</>
	);
};

const SignedOut = ({ onClick }: { onClick?: () => void }) => {
	return (
		<>
			<li className='block'>
				<Button
					variant='ghost'
					size='default'
					className='bg-transparent border-2 border-white hover:bg-slate-700 hover:bg-opacity-10 rounded-lg px-2 py-2 text-center font-medium w-full md:w-auto'
					asChild>
					<Link
						href='/auth/signin'
						onClick={onClick}>
						Sign In
					</Link>
				</Button>
			</li>
			<li className='block'>
				<Button
					size='default'
					className='bg-transparent border-2 border-white hover:bg-slate-700 hover:bg-opacity-10 rounded-lg px-2 py-2 text-center font-medium w-full md:w-auto'
					asChild>
					<Link
						href='/auth/signup'
						onClick={onClick}>
						Sign Up
					</Link>
				</Button>
			</li>
		</>
	);
};
