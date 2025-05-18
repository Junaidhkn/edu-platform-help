import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import db from '@/src/db';
import { orders } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import OrderAcceptForm from '@/src/components/admin/OrderAcceptForm';

interface AcceptOrderPageProps {
	params: {
		id: string;
	};
}

export const metadata = {
	title: 'Accept Order | Admin Dashboard',
	description: 'Accept customer order and send notification',
};

export default async function AcceptOrderPage({
	params,
}: AcceptOrderPageProps) {
	const session = await auth();

	if (!session?.user || session.user.role !== 'admin') {
		redirect('/');
	}

	// Fetch order with relations
	const order = await db.query.orders.findFirst({
		where: eq(orders.id, params.id),
		with: {
			user: true,
		},
	});

	if (!order) {
		redirect('/dashboard/orders');
	}

	// If order is not in pending status, redirect back
	if (order.orderStatus !== 'pending') {
		redirect(`/dashboard/orders/${params.id}`);
	}

	return (
		<div className='container mx-auto py-10'>
			<div className='max-w-2xl mx-auto'>
				<h1 className='text-2xl font-bold mb-6'>
					Accept Order #{order.id.slice(-6)}
				</h1>

				<div className='bg-white p-6 rounded-lg shadow'>
					<OrderAcceptForm
						orderId={order.id}
						userEmail={order.user?.email || ''}
						userName={order.user?.name || ''}
					/>
				</div>
			</div>
		</div>
	);
}
