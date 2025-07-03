import Link from 'next/link';
import { auth } from '@/auth';
import { Button } from '@/src/components/ui/button';
import { type User } from 'next-auth';
import { findOrdersbyUserId } from '../resources/queries';

export default async function ProfilePage({
	searchParams,
}: {
	searchParams: { status?: string; page?: string };
}) {
	const session = await auth();
	return (
		<main className='mt-4 pb-24'>
			<div className='container'>
				<div className='flex items-center justify-between'>
					<h1 className='text-3xl font-bold tracking-tight'>
						Hi, Welcome 👋 {session?.user?.name ?? 'to your Profile'} !
					</h1>
				</div>

				<div className='my-4 h-1 bg-muted' />

				{!!session?.user ? (
					<SignedIn
						user={session.user}
						status={searchParams.status || 'pending'}
						page={Number(searchParams.page || '1')}
					/>
				) : (
					<SignedOut />
				)}
			</div>
		</main>
	);
}

const SignedIn = async ({
	user,
	status,
	page,
}: {
	user: User;
	status: string;
	page: number;
}) => {
	const orders = await findOrdersbyUserId(user.id as string);

	// Format date as ISO string for consistent rendering
	const formatDate = (dateStr: string) => {
		if (!dateStr) return 'N/A';
		try {
			// Use consistent YYYY-MM-DD format to avoid hydration issues
			const date = new Date(dateStr);
			return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
				2,
				'0',
			)}-${String(date.getDate()).padStart(2, '0')}`;
		} catch (e) {
			return 'Invalid date';
		}
	};

	// Status badge color mapping
	const getStatusColor = (status: string) => {
		const statusMap: Record<string, string> = {
			pending: 'bg-yellow-100 text-yellow-800',
			'in-progress': 'bg-blue-100 text-blue-800',
			completed: 'bg-green-100 text-green-800',
			cancelled: 'bg-red-100 text-red-800',
		};
		return statusMap[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
	};

	// Filter orders by status
	const filteredOrders =
		status === 'all'
			? orders
			: orders.filter(
					(order: any) =>
						order.orderStatus?.toLowerCase() === status.toLowerCase(),
			  );

	// Sort orders by creation date (newest first)
	const sortedOrders = [...filteredOrders].sort((a, b) => {
		return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
	});

	// Pagination
	const ITEMS_PER_PAGE = 6;
	const totalPages = Math.ceil(sortedOrders.length / ITEMS_PER_PAGE);
	const currentPage = page < 1 ? 1 : page > totalPages ? totalPages || 1 : page;
	const paginatedOrders = sortedOrders.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE,
	);

	// Order counts by status
	const pendingCount = orders.filter(
		(order: any) => order.orderStatus?.toLowerCase() === 'pending',
	).length;
	const inProgressCount = orders.filter(
		(order: any) => order.orderStatus?.toLowerCase() === 'in-progress',
	).length;
	const completedCount = orders.filter(
		(order: any) => order.orderStatus?.toLowerCase() === 'completed',
	).length;
	const allCount = orders.length;

	return (
		<>
			<div className='flex items-center justify-between mb-6'>
				<h2 className='text-2xl font-bold tracking-tight'>Your Orders</h2>
				<Button asChild>
					<Link href='/profile/place-order'>+ New Order</Link>
				</Button>
			</div>

			{/* Status Filters */}
			<div className='flex flex-wrap gap-2 mb-6'>
				<Link
					href={`/profile?status=pending&page=1`}
					className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
						status === 'pending'
							? 'bg-yellow-100 text-yellow-800 border-yellow-300'
							: 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
					}`}>
					Pending ({pendingCount})
				</Link>
				<Link
					href={`/profile?status=in-progress&page=1`}
					className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
						status === 'in-progress'
							? 'bg-blue-100 text-blue-800 border-blue-300'
							: 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
					}`}>
					In Progress ({inProgressCount})
				</Link>
				<Link
					href={`/profile?status=completed&page=1`}
					className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
						status === 'completed'
							? 'bg-green-100 text-green-800 border-green-300'
							: 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
					}`}>
					Completed ({completedCount})
				</Link>
				<Link
					href={`/profile?status=all&page=1`}
					className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
						status === 'all'
							? 'bg-gray-800 text-white border-gray-900'
							: 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
					}`}>
					All Orders ({allCount})
				</Link>
			</div>

			<div className='mt-4'>
				{/* Order Cards Section */}
				{filteredOrders.length > 0 ? (
					<>
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
							{paginatedOrders.map((order: any) => {
								// Pre-compute these values to ensure consistent rendering
								const formattedCreatedDate = formatDate(order.createdAt);
								const formattedDeadlineDate = formatDate(order.deadline);
								const statusColorClass = getStatusColor(order.orderStatus);
								const truncatedId = order.id ? order.id.substring(0, 8) : 'N/A';
								const priceDisplay = order.total_price
									? `$${parseFloat(order.total_price).toFixed(2)}`
									: 'N/A';

								return (
									<Link
										href={`/profile/orders/${order.id}`}
										key={order.id}
										className='group block'>
										<div className='bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-all duration-200 hover:shadow-lg hover:border-blue-300'>
											{/* Card Header with Status */}
											<div className='bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center'>
												<span className='font-medium text-gray-700 truncate'>
													Order #{truncatedId}
												</span>
												<span
													className={`px-2.5 py-0.5 rounded-full text-xs font-medium text-red-600 bg-green-100`}>
													{order.isPaid ? 'Paid' : 'yet to pay'}
												</span>
												<span
													className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColorClass}`}>
													{order.orderStatus || 'Unknown'}
												</span>
											</div>

											{/* Card Content */}
											<div className='p-4'>
												<div className='space-y-3'>
													{/* Type and Subject */}
													<div className='grid grid-cols-2 gap-2'>
														<div>
															<p className='text-xs text-gray-500'>Type</p>
															<p className='font-medium capitalize'>
																{order.typeCategory || 'N/A'}
															</p>
														</div>
														<div>
															<p className='text-xs text-gray-500'>Subject</p>
															<p className='font-medium capitalize'>
																{order.subjectCategory || 'N/A'}
															</p>
														</div>
													</div>

													{/* Academic Level and Pages */}
													<div className='grid grid-cols-2 gap-2'>
														<div>
															<p className='text-xs text-gray-500'>
																Academic Level
															</p>
															<p className='font-medium capitalize'>
																{order.academicLevel || 'N/A'}
															</p>
														</div>
														<div>
															<p className='text-xs text-gray-500'>Pages</p>
															<p className='font-medium'>
																{order.pages || 'N/A'}
															</p>
														</div>
													</div>

													{/* Dates */}
													<div className='grid grid-cols-2 gap-2 pt-2 border-t border-gray-100'>
														<div>
															<p className='text-xs text-gray-500'>Created</p>
															<p className='font-medium'>
																{formattedCreatedDate}
															</p>
														</div>
														<div>
															<p className='text-xs text-gray-500'>Deadline</p>
															<p className='font-medium text-red-600'>
																{formattedDeadlineDate}
															</p>
														</div>
													</div>
												</div>
											</div>

											{/* Card Footer */}
											<div className='bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-between items-center'>
												<span className='font-bold text-gray-900'>
													{priceDisplay}
												</span>

												<span className='text-blue-600 text-sm font-medium group-hover:underline'>
													View Details →
												</span>
											</div>
										</div>
									</Link>
								);
							})}
						</div>

						{/* Pagination Controls */}
						{totalPages > 1 && (
							<div className='flex justify-center space-x-2 mt-8'>
								<Link
									href={`/profile?status=${status}&page=${Math.max(
										1,
										currentPage - 1,
									)}`}
									className={`px-4 py-2 border rounded-md ${
										currentPage <= 1
											? 'bg-gray-100 text-gray-400 cursor-not-allowed'
											: 'bg-white text-blue-600 hover:bg-blue-50'
									}`}
									aria-disabled={currentPage <= 1}>
									Previous
								</Link>

								{Array.from({ length: totalPages }, (_, i) => i + 1).map(
									(pageNumber) => (
										<Link
											key={pageNumber}
											href={`/profile?status=${status}&page=${pageNumber}`}
											className={`px-4 py-2 border rounded-md ${
												pageNumber === currentPage
													? 'bg-blue-600 text-white border-blue-600'
													: 'bg-white text-gray-700 hover:bg-gray-50'
											}`}>
											{pageNumber}
										</Link>
									),
								)}

								<Link
									href={`/profile?status=${status}&page=${Math.min(
										totalPages,
										currentPage + 1,
									)}`}
									className={`px-4 py-2 border rounded-md ${
										currentPage >= totalPages
											? 'bg-gray-100 text-gray-400 cursor-not-allowed'
											: 'bg-white text-blue-600 hover:bg-blue-50'
									}`}
									aria-disabled={currentPage >= totalPages}>
									Next
								</Link>
							</div>
						)}
					</>
				) : (
					<div className='bg-white rounded-lg shadow p-8 text-center'>
						<div className='mb-4'>
							<div className='mx-auto h-12 w-12 text-gray-400 flex items-center justify-center'>
								📄
							</div>
						</div>
						<h3 className='text-lg font-medium text-gray-900'>
							{status === 'all' ? 'No orders yet' : `No ${status} orders found`}
						</h3>
						<p className='mt-2 text-sm text-gray-600 max-w-md mx-auto'>
							{status === 'all'
								? "You haven't placed any orders yet. Click the button below to get started with your first order."
								: `You don't have any orders with ${status} status. ${
										status === 'pending'
											? 'Click the button below to place a new order.'
											: 'Check other status filters to see all your orders.'
								  }`}
						</p>
						<div className='mt-6 flex justify-center gap-4'>
							{status !== 'all' && (
								<Button
									asChild
									variant='outline'>
									<Link href='/profile?status=all&page=1'>View All Orders</Link>
								</Button>
							)}
							<Button asChild>
								<Link href='/profile/place-order'>Place New Order</Link>
							</Button>
						</div>
					</div>
				)}

				{/* Customer Service Section */}
				<div className='mt-12 bg-blue-50 rounded-lg p-6 shadow-sm border border-blue-100'>
					<h3 className='text-xl font-semibold text-blue-900'>
						Customer Support
					</h3>
					<p className='mt-2 text-blue-800'>
						If you have any questions or need assistance with your orders, our
						customer service team is ready to help you.
					</p>
				</div>
			</div>
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
