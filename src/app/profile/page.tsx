import Link from 'next/link';
import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import { type User } from 'next-auth';

export default async function ProfilePage({ user }: { user: User }) {
	const session = await auth();

	return (
		<main className='mt-4'>
			<div className='container'>
				<div className='flex items-center justify-between'>
					<h1 className='text-3xl font-bold tracking-tight'>
						Hi, Welcome 👋 {session?.user?.name ?? 'to your Profile'} !
					</h1>
				</div>

				<div className='my-4 h-1 bg-muted' />

				{!!session?.user ? <SignedIn user={session.user} /> : <SignedOut />}
			</div>
		</main>
	);
}

const SignedIn = ({ user }: { user: User }) => {
	return (
		<>
			<div className='flex items-center justify-between'>
				<h2 className='text-2xl font-bold tracking-tight'>Order summary:</h2>
			</div>
			{/* button that takes to the form to generate order */}
			{/* if you want to discuss, contact our team here */}
			<div className='my-2 h-1 bg-muted' />
		</>
	);
};

const SignedOut = () => {
	return (
		<>
			<h2 className='text-2xl font-bold tracking-tight'>User Not Signed In</h2>

			<div className='my-2 h-1 bg-muted' />

			<Button asChild>
				<Link href='/auth/signin'>Sign In</Link>
			</Button>
		</>
	);
};
