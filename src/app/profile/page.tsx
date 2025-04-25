import Link from 'next/link';
import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import { type User } from 'next-auth';
import { findOrdersbyUserId } from '../../../resources/queries';

export default async function ProfilePage() {
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

const SignedIn = async ({ user }: { user: User }) => {
	const orders = await findOrdersbyUserId(user.id as string);
	console.log('orders', orders[0]);
	return (
		<>
			<div className='flex items-center justify-between'>
				<h2 className='text-2xl font-bold tracking-tight'>
					Your Order summary:
				</h2>
			</div>
			<div className='mt-4 flex-col justify-evenly '>
				{/* Order Summary Section */}
				<div className='w-full flex justify-center items-center mb-6'>
					<div>
						<h3 className='text-xl font-semibold'>Order Summary:</h3>
						{orders && orders.length > 0 ? (
							<div className='mt-2 space-y-2'>
								{orders.map((order) => (
									<Link
									href={`profile/orders/${order.id}`}
										key={order.id}
										className='p-4 border rounded-lg'>
										<div className='flex justify-between'>
											<span>Order ID: {order.createdAt}</span>
											<span>Order ID: {order.deadline}</span>
											<span>Status: {order.orderStatus}</span>
										</div>
									</Link>
								))}
							</div>
						) : (
							<div>
								<p className='mt-2'>You are yet to place any order!</p>
								<span className='mt-2 text-sm text-gray-600'>
									Click the button below or contact our customer service before
									submitting any order
								</span>
							</div>
						)}
						<Button
							asChild
							className='mt-4'>
							<Link href='/profile/place-order'>Place an Order</Link>
						</Button>
					</div>
				</div>

				{/* Customer Service Section */}
				<div>
					<h3 className='text-xl font-semibold'>Customer Service</h3>
					<p className='mt-2'>
						If you have any questions or need assistance before placing an
						order, please contact our customer service team. We are here to help
						you.
					</p>
					<p className='mt-2 text-sm text-gray-600'>
						Please note that you can contact us through WhatsApp currently, as
						our real-time chat feature is under development.
					</p>
				</div>
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
