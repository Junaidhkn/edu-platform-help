import  OverViewPage  from '@/sections/overview/view/overview';
import { CreateAdminButton } from '@/components/admin/CreateAdminButton';
import db from '@/src/db';
import { orders } from '@/src/db/schema';
import { desc, eq } from 'drizzle-orm';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EyeIcon } from 'lucide-react';

export const metadata = {
	title: 'Dashboard : Admin Overview',
	description: 'Admin dashboard overview',
};

export default async function DashboardPage() {
	// Admin check happens at the layout level
	
	// Fetch 5 most recent orders
	const recentOrders = await db.query.orders.findMany({
		orderBy: [desc(orders.createdAt)],
		limit: 10,
		with: {
			user: {
				columns: {
					name: true,
					email: true,
				},
			},
		},
	});

	// Function to determine badge color based on order status
	const getStatusColor = (status: string) => {
		switch (status) {
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

	return (
		<>
			{/* <OverViewPage /> */}
			
			<div className="container mx-auto mt-10">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl font-bold">Recent Orders</h2>
					<Link href="/dashboard/orders">
						<Button variant="outline">View All Orders</Button>
					</Link>
				</div>
				
				<div className="bg-white shadow-md rounded-lg overflow-hidden">
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Order ID
									</th>
									<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Customer
									</th>
									<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Subject
									</th>
									<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Price
									</th>
									<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Status
									</th>
									<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Date
									</th>
									<th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{recentOrders.length > 0 ? (
									recentOrders.map((order) => (
										<tr key={order.id}>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
												#{order.id.slice(-6)}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm">
												{order.user?.name || 'Unknown'}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm">
												{order.subjectCategory || 'N/A'}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm">
												{formatCurrency(Number(order.price))}
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<Badge className={getStatusColor(order.orderStatus)}>
													{order.orderStatus}
												</Badge>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
												{new Date(order.createdAt).toLocaleDateString()}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
												<Link href={`/dashboard/orders/${order.id}`}>
													<Button size="sm" variant="ghost">
														<EyeIcon className="h-4 w-4 mr-1" />
														View
													</Button>
												</Link>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
											No orders found
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
			
			<div className="fixed bottom-6 right-6">
				<CreateAdminButton />
			</div>
		</>
	);
}
