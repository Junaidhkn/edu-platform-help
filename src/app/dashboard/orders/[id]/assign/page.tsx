import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { toast } from 'sonner';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { ChevronLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import AssignOrderClient from '@/src/components/admin/AssignOrderClient';
import db from '@/src/db';
import {
	freelancers as freelancersSchema,
	orders as ordersSchema,
} from '@/src/db/schema';
import { eq, desc } from 'drizzle-orm';

interface AssignOrderPageProps {
	params: {
		id: string;
	};
}

export default async function AssignOrderPage({
	params,
}: AssignOrderPageProps) {
	const session = await auth();
	if (!session?.user || session.user.role !== 'admin') {
		redirect('/');
	}

	const orderId = params.id;

	// Fetch order details server-side
	const order = await db.query.orders.findFirst({
		where: eq(ordersSchema.id, orderId),
	});

	if (!order) {
		// Consider showing a not found page or redirecting with an error
		toast.error('Order not found'); // Note: toast might not work directly in Server Components for initial render
		redirect('/dashboard/orders');
	}

	// Check if order status allows assignment
	if (order.orderStatus !== 'accepted') {
		// Redirect back with a message (maybe use query params or flash messages if set up)
		redirect(`/dashboard/orders/${orderId}?error=Order must be accepted first`);
	}

	// Fetch freelancers server-side
	const freelancers = await db
		.select()
		.from(freelancersSchema)
		.orderBy(desc(freelancersSchema.createdAt));

	// Convert rating to number for the client component
	const formattedFreelancers = freelancers.map((f) => ({
		...f,
		rating: f.rating ? Number(f.rating) : undefined,
	}));

	return (
		<div className='container mx-auto py-10'>
			<div className='flex flex-col gap-6'>
				<div className='flex items-center'>
					<Link href={`/dashboard/orders/${orderId}`}>
						<Button
							variant='ghost'
							className='mr-4'>
							<ChevronLeft className='h-4 w-4 mr-1' />
							Back to Order
						</Button>
					</Link>
					<h1 className='text-2xl font-bold'>Assign Order to Freelancer</h1>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Order #{orderId.substring(0, 8)}</CardTitle>
						<CardDescription>
							Select a freelancer to assign this order
						</CardDescription>
					</CardHeader>
					<CardContent>
						{/* Pass fetched data to the Client Component */}
						<AssignOrderClient
							orderId={orderId}
							freelancers={formattedFreelancers}
						/>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
