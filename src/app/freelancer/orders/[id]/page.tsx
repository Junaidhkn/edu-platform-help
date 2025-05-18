import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/src/components/ui/card';
import {
	TabsContent,
	Tabs,
	TabsList,
	TabsTrigger,
} from '@/src/components/ui/tabs';
import { auth } from '@/auth';
import db from '@/src/db';
import { orders } from '@/src/db/schema';
import { submissions } from '@/src/db/schema';
import { eq, and } from 'drizzle-orm';
import { ArrowLeft } from 'lucide-react';
import { formatCurrency } from '@/src/lib/utils';
import SubmissionUploader from '@/src/components/freelancer/submission-uploader';
import SubmissionHistory from '@/src/components/freelancer/submission-history';

interface OrderDetailPageProps {
	params: {
		id: string;
	};
}

export const metadata = {
	title: 'Order Details',
	description: 'View order details and submit completed work',
};

export default async function FreelancerOrderPage({
	params,
}: OrderDetailPageProps) {
	const session = await auth();

	if (!session?.user) {
		redirect('/auth/signin');
	}

	// If user is not a freelancer with isFreelancer flag, redirect to homepage
	if (!(session.user as any).isFreelancer) {
		redirect('/');
	}

	const freelancerId = session.user.id;

	// Fetch order with assignment information
	const orderData = await db.query.orders.findFirst({
		where: eq(orders.id, params.id),
		with: {
			user: {
				columns: {
					id: true,
					name: true,
					email: true,
				},
			},
		},
	});

	// If order not found or not assigned to this freelancer, return 404
	if (!orderData) {
		notFound();
	}

	// Check if order is assigned to this freelancer
	const isAssigned = orderData.freelancerId === freelancerId;

	if (!isAssigned) {
		notFound();
	}

	// Get past submissions for this order
	const submissionHistory = await db.query.submissions.findMany({
		where: and(
			eq(submissions.orderId, params.id),
			eq(submissions.freelancerId, freelancerId),
		),
		orderBy: (submissions, { desc }) => [desc(submissions.createdAt)],
	});

	// Check if order is active and can accept submissions
	const canSubmit = ['accepted', 'in_progress', 'submitted'].includes(
		orderData.orderStatus,
	);

	// Function to determine badge color based on order status
	const getStatusColor = (status: string) => {
		switch (status) {
			case 'accepted':
			case 'in_progress':
				return 'bg-green-100 text-green-800';
			case 'submitted':
				return 'bg-yellow-100 text-yellow-800';
			case 'completed':
				return 'bg-blue-100 text-blue-800';
			case 'rejected':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	// Format dates for display
	const formatDate = (dateString: string) => {
		return format(new Date(dateString), 'MMMM dd, yyyy HH:mm');
	};

	return (
		<div className='max-w-5xl mx-auto py-8 px-4'>
			<div className='mb-6'>
				<Link href='/freelancer/orders'>
					<Button
						variant='ghost'
						size='sm'>
						<ArrowLeft className='h-4 w-4 mr-1' />
						Back to Orders
					</Button>
				</Link>
			</div>

			<h1 className='text-3xl font-bold mb-8'>Order Details</h1>

			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				{/* Order Summary */}
				<Card className='md:col-span-2'>
					<CardHeader>
						<div className='flex justify-between items-start'>
							<div>
								<CardTitle>Order #{orderData.id.slice(-6)}</CardTitle>
								<CardDescription>
									Created on {format(new Date(orderData.createdAt), 'PPP')}
								</CardDescription>
							</div>
							<Badge className={getStatusColor(orderData.orderStatus)}>
								{orderData.orderStatus
									.replace(/_/g, ' ')
									.replace(/\b\w/g, (c: string) => c.toUpperCase())}
							</Badge>
						</div>
					</CardHeader>
					<CardContent>
						<div className='space-y-4'>
							<div>
								<h3 className='font-medium'>Subject</h3>
								<p>{orderData.subjectCategory || 'Not specified'}</p>
							</div>

							<div>
								<h3 className='font-medium'>Type</h3>
								<p>{orderData.typeCategory}</p>
							</div>

							<div>
								<h3 className='font-medium'>Description</h3>
								<p className='whitespace-pre-line'>{orderData.description}</p>
							</div>

							{orderData.deadline && (
								<div>
									<h3 className='font-medium'>Deadline</h3>
									<p>{format(new Date(orderData.deadline), 'PPP p')}</p>
								</div>
							)}

							<div>
								<h3 className='font-medium'>Associated files</h3>
								{orderData.uploadedfileslink ? (
									<div className='mt-2'>
										<ul className='list-disc list-inside space-y-1'>
											{(() => {
												try {
													// Parse JSON string format ["url1", "url2"]
													const fileUrls = JSON.parse(
														orderData.uploadedfileslink,
													);
													return Array.isArray(fileUrls) ? (
														fileUrls.map((file, index) => (
															<li
																className='list-none'
																key={index}>
																<a
																	href={file}
																	target='_blank'
																	rel='noopener noreferrer'
																	className='text-blue-600 hover:underline'>
																	Download File {index + 1}
																</a>
															</li>
														))
													) : (
														<li>
															<a
																href={orderData.uploadedfileslink}
																target='_blank'
																rel='noopener noreferrer'
																className='text-blue-600 hover:underline'>
																Download File
															</a>
														</li>
													);
												} catch (error) {
													// Fallback for non-JSON format
													return (
														<li>
															<a
																href={orderData.uploadedfileslink}
																target='_blank'
																rel='noopener noreferrer'
																className='text-blue-600 hover:underline'>
																Download File
															</a>
														</li>
													);
												}
											})()}
										</ul>
									</div>
								) : (
									<p className='text-gray-500'>No files available</p>
								)}
							</div>

							{/* Completed Files (if different from uploaded files) */}
							{orderData.completedFileUrls && (
								<div>
									<h3 className='font-medium mt-4'>Completed files</h3>
									<div className='mt-2'>
										<ul className='list-disc list-inside space-y-1'>
											{(() => {
												try {
													// Handle both comma-separated strings and try JSON parsing
													if (orderData.completedFileUrls.startsWith('[')) {
														// Try parsing as JSON
														const fileUrls = JSON.parse(
															orderData.completedFileUrls,
														);
														return Array.isArray(fileUrls)
															? fileUrls.map((file, index) => (
																	<li key={index}>
																		<a
																			href={file}
																			target='_blank'
																			rel='noopener noreferrer'
																			className='text-blue-600 hover:underline'>
																			Download Completed File {index + 1}
																		</a>
																	</li>
															  ))
															: null;
													} else {
														// Handle as comma-separated string
														const fileUrls =
															orderData.completedFileUrls.includes(',')
																? orderData.completedFileUrls
																		.split(',')
																		.map((url) => url.trim())
																: [orderData.completedFileUrls];

														return fileUrls.map((file, index) => (
															<li key={index}>
																<a
																	href={file}
																	target='_blank'
																	rel='noopener noreferrer'
																	className='text-blue-600 hover:underline'>
																	Download Completed File {index + 1}
																</a>
															</li>
														));
													}
												} catch (error) {
													// Fallback for any parsing errors
													return (
														<li>
															<a
																href={orderData.completedFileUrls}
																target='_blank'
																rel='noopener noreferrer'
																className='text-blue-600 hover:underline'>
																Download Completed File
															</a>
														</li>
													);
												}
											})()}
										</ul>
									</div>
								</div>
							)}
						</div>
					</CardContent>
				</Card>

				{/* File Submission */}
				<div className='md:col-span-1'>
					{canSubmit ? (
						<SubmissionUploader orderId={params.id} />
					) : (
						<Card>
							<CardHeader>
								<CardTitle>Submission Status</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='bg-muted p-4 rounded-md text-center'>
									{orderData.orderStatus === 'completed' ? (
										<p>This order has been completed.</p>
									) : orderData.orderStatus === 'cancelled' ? (
										<p>This order has been cancelled.</p>
									) : (
										<p>
											Submissions are currently not accepted for this order.
										</p>
									)}
								</div>
							</CardContent>
						</Card>
					)}
				</div>
			</div>

			{/* Submission History */}
			{submissionHistory.length > 0 && (
				<div className='mt-8'>
					<h2 className='text-xl font-semibold mb-4'>Submission History</h2>
					<SubmissionHistory submissions={submissionHistory} />
				</div>
			)}
		</div>
	);
}
