import React from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/src/components/ui/table';
import { Badge } from '@/src/components/ui/badge';

// Accept any transaction shape from database
interface TransactionsTableProps {
	transactions: any[];
}

export default function TransactionsTable({
	transactions,
}: TransactionsTableProps) {
	// Function to get status badge color
	const getStatusColor = (status: string) => {
		switch (status) {
			case 'succeeded':
				return 'bg-green-100 text-green-800';
			case 'pending':
				return 'bg-yellow-100 text-yellow-800';
			case 'processing':
				return 'bg-blue-100 text-blue-800';
			case 'failed':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	// Format date
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleString();
	};

	// Format currency
	const formatCurrency = (amount: number) => {
		return `$${(amount / 100).toFixed(2)}`;
	};

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Transaction ID</TableHead>
					<TableHead>Date</TableHead>
					<TableHead>Customer</TableHead>
					<TableHead>Amount</TableHead>
					<TableHead>Status</TableHead>
					<TableHead>Order ID</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{transactions.length === 0 ? (
					<TableRow>
						<TableCell
							colSpan={6}
							className='text-center py-6'>
							No transactions found
						</TableCell>
					</TableRow>
				) : (
					transactions.map((transaction) => (
						<TableRow key={transaction.id}>
							<TableCell className='font-medium'>
								{transaction.id.substring(0, 8)}...
							</TableCell>
							<TableCell>{formatDate(transaction.createdAt)}</TableCell>
							<TableCell>
								{transaction.user ? (
									<>
										<div>{transaction.user.name}</div>
										<div className='text-sm text-gray-500'>
											{transaction.user.email}
										</div>
									</>
								) : (
									'Unknown'
								)}
							</TableCell>
							<TableCell>{formatCurrency(transaction.amount)}</TableCell>
							<TableCell>
								<Badge className={getStatusColor(transaction.status)}>
									{transaction.status}
								</Badge>
							</TableCell>
							<TableCell>
								<span className='text-sm'>{transaction.orderId}</span>
							</TableCell>
						</TableRow>
					))
				)}
			</TableBody>
		</Table>
	);
}
