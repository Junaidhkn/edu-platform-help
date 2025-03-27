import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import db from '@/src/db';
import transaction from '@/src/db/schema/transactions';
import { desc } from 'drizzle-orm';
import TransactionsTable from '@/components/admin/TransactionsTable';

export const metadata = {
	title: 'Transactions | Admin Dashboard',
	description: 'View and manage payment transactions',
};

export default async function TransactionsPage() {
	const session = await auth();

	if (!session?.user || session.user.role !== 'admin') {
		redirect('/');
	}

	// Fetch all transactions with relations
	const transactions = await db.query.transaction.findMany({
		orderBy: [desc(transaction.createdAt)],
		with: {
			user: {
				columns: {
					name: true,
					email: true,
				},
			},
			order: true,
		},
	});

	return (
		<div className='container mx-auto py-10'>
			<div className='flex justify-between items-center mb-6'>
				<h1 className='text-2xl font-bold'>Payment Transactions</h1>
			</div>

			<div className='bg-white rounded-lg shadow overflow-hidden'>
				<div className='p-6'>
					<h2 className='text-lg font-medium mb-4'>Transaction History</h2>
					<TransactionsTable transactions={transactions as any[]} />
				</div>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-8'>
				<div className='bg-white p-6 rounded-lg shadow'>
					<h3 className='text-lg font-medium mb-2'>Total Revenue</h3>
					<p className='text-3xl font-bold'>
						$
						{transactions
							.filter((t) => t.status === 'succeeded')
							.reduce((sum, t) => sum + t.amount / 100, 0)
							.toFixed(2)}
					</p>
				</div>

				<div className='bg-white p-6 rounded-lg shadow'>
					<h3 className='text-lg font-medium mb-2'>Successful Payments</h3>
					<p className='text-3xl font-bold'>
						{transactions.filter((t) => t.status === 'succeeded').length}
					</p>
				</div>

				<div className='bg-white p-6 rounded-lg shadow'>
					<h3 className='text-lg font-medium mb-2'>Pending Payments</h3>
					<p className='text-3xl font-bold'>
						{transactions.filter((t) => t.status === 'pending').length}
					</p>
				</div>
			</div>
		</div>
	);
}
