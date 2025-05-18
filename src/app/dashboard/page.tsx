'use client';

import { CreateAdminButton } from '@/src/components/admin/CreateAdminButton';
import Link from 'next/link';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { EyeIcon } from 'lucide-react';
import { Pagination } from '@/src/components/pagination';
import { OrderFilters, OrderFilterType } from '@/src/components/order-filters';
import { useCallback, useEffect, useState } from 'react';

const ITEMS_PER_PAGE = 7; // Show 7 orders per page

export default function DashboardPage() {
	const [orders, setOrders] = useState<any[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [activeFilter, setActiveFilter] = useState<OrderFilterType>('recent');
	const [isLoading, setIsLoading] = useState(true);

	// Function to determine badge color based on order status
	const getStatusColor = (status: string) => {
		switch (status?.toLowerCase()) {
			case 'pending':
				return 'bg-yellow-100 text-yellow-800';
			case 'accepted':
				return 'bg-green-100 text-green-800';
			case 'rejected':
				return 'bg-red-100 text-red-800';
			case 'completed':
				return 'bg-blue-100 text-blue-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	// Function to format currency
	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		}).format(amount);
	};

	const fetchOrders = useCallback(async () => {
		setIsLoading(true);
		try {
			const response = await fetch(
				`/api/dashboard/orders?page=${currentPage}&filter=${activeFilter}`,
			);
			const data = await response.json();
			setOrders(data.orders);
			setTotalPages(Math.ceil(data.total / ITEMS_PER_PAGE));
		} catch (error) {
			console.error('Error fetching orders:', error);
		} finally {
			setIsLoading(false);
		}
	}, [currentPage, activeFilter]);

	useEffect(() => {
		fetchOrders();
	}, [fetchOrders]);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const handleFilterChange = (filter: OrderFilterType) => {
		setActiveFilter(filter);
		setCurrentPage(1); // Reset to first page when changing filters
	};

	return (
		<>
			<div className='container mx-auto mt-10 mb-14'>
				<div className='flex justify-between items-center mb-6'>
					<h2 className='text-2xl font-bold'>Orders</h2>
					<Link href='/dashboard/orders'>
						<Button variant='outline'>View All Orders</Button>
					</Link>
				</div>

				<OrderFilters
					activeFilter={activeFilter}
					onFilterChange={handleFilterChange}
				/>

				<div className='bg-white shadow-md rounded-lg overflow-hidden'>
					<div className='overflow-x-auto'>
						<table className='min-w-full divide-y divide-gray-200'>
							<thead className='bg-gray-50'>
								<tr>
									<th
										scope='col'
										className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Order ID
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Customer
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Subject
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Price
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Status
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Date
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Actions
									</th>
								</tr>
							</thead>
							<tbody className='bg-white divide-y divide-gray-200'>
								{isLoading ? (
									<tr>
										<td
											colSpan={7}
											className='px-6 py-4 text-center'>
											Loading...
										</td>
									</tr>
								) : orders.length > 0 ? (
									orders.map((order) => (
										<tr key={order.id}>
											<td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
												#{order.id.slice(-6)}
											</td>
											<td className='px-6 py-4 whitespace-nowrap text-sm'>
												{order.user?.name || 'Unknown'}
											</td>
											<td className='px-6 py-4 whitespace-nowrap text-sm'>
												{order.subjectCategory || 'N/A'}
											</td>
											<td className='px-6 py-4 whitespace-nowrap text-sm'>
												{formatCurrency(Number(order.price))}
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												<Badge className={getStatusColor(order.orderStatus)}>
													{order.orderStatus || 'pending'}
												</Badge>
											</td>
											<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
												{new Date(order.createdAt).toLocaleDateString()}
											</td>
											<td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
												<Link href={`/dashboard/orders/${order.id}`}>
													<Button
														size='sm'
														variant='ghost'>
														<EyeIcon className='h-4 w-4 mr-1' />
														View
													</Button>
												</Link>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td
											colSpan={7}
											className='px-6 py-4 text-center text-sm text-gray-500'>
											No orders found
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>

				{!isLoading && totalPages > 1 && (
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={handlePageChange}
					/>
				)}
			</div>

			<div className='fixed bottom-6 right-6'>
				<CreateAdminButton />
			</div>
		</>
	);
}
