import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import {
	ArrowLeft,
	StarIcon,
	Mail,
	Info,
	FileText,
	DownloadIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import db from '@/src/db';
import { formatCurrency } from '@/lib/utils';

interface OrderDetailPageProps {
	params: {
		id: string;
	};
}

// Helper to parse and clean URLs
function parseAndCleanUrls(urlString: string | null | undefined): string[] {
	if (!urlString) return [];

	try {
		let urls: string[] = [];
		try {
			urls = JSON.parse(urlString);
			if (!Array.isArray(urls)) throw new Error();
		} catch {
			// fallback: split by comma
			urls = urlString
				.split(',')
				.map((u) => u.trim())
				.filter(Boolean);
		}
		// Final filter to ensure only valid strings remain
		return urls.filter((url) => typeof url === 'string' && url.length > 0);
	} catch {
		return []; // Return empty array if any parsing fails
	}
}

export default async function OrderDetailPage({
	params,
}: OrderDetailPageProps) {
	const session = await auth();

	if (!session?.user) {
		redirect('/login');
	}

	const userId = session.user.id;
	if (!userId) {
		redirect('/login');
	}

	const order = await db.query.orders.findFirst({
		where: (order, { eq, and }) =>
			and(eq(order.id, params.id), eq(order.userId, userId)),
		with: {
			freelancer: true,
		},
	});

	console.log('Order in detail page', order);

	if (!order) {
		redirect('/profile/orders');
	}

	const existingReview = await db.query.review.findFirst({
		where: (review, { eq }) => eq(review.orderId, params.id),
	});

	const hasReview = !!existingReview;

	// Safe date formatting
	const formatDate = (dateString: string | null | undefined): string => {
		if (!dateString) return 'Not specified';
		try {
			return format(parseISO(dateString), "MMM dd, yyyy 'at' HH:mm");
		} catch (e) {
			return 'Invalid date';
		}
	};

	// Status badge color
	const getStatusColor = (status: string | null | undefined): string => {
		switch (status?.toLowerCase() || '') {
			case 'pending':
				return 'bg-yellow-100 text-yellow-800 border-yellow-300';
			case 'accepted':
				return 'bg-green-100 text-green-800 border-green-300';
			case 'rejected':
				return 'bg-red-100 text-red-800 border-red-300';
			case 'completed':
				return 'bg-blue-100 text-blue-800 border-blue-300';
			default:
				return 'bg-gray-100 text-gray-800 border-gray-300';
		}
	};

	const getStatusPillColor = (status: string | null | undefined): string => {
		switch (status?.toLowerCase() || '') {
			case 'pending':
				return 'bg-yellow-500';
			case 'accepted':
				return 'bg-green-500';
			case 'rejected':
				return 'bg-red-500';
			case 'completed':
				return 'bg-blue-500';
			default:
				return 'bg-gray-500';
		}
	};

	// Parse file links safely
	const uploadedFileLinks = parseAndCleanUrls(order.uploadedfileslink);
	const completedFileLinks = parseAndCleanUrls(order.completedFileUrls);

	return (
		<div className='bg-slate-50 min-h-screen py-8 md:py-12'>
			<div className='container mx-auto px-4'>
				<div className='mb-8'>
					<Link
						href='/profile'
						className='inline-flex items-center text-slate-600 hover:text-slate-800 transition-colors'>
						<Button
							variant='ghost'
							size='sm'
							className='pl-0'>
							<ArrowLeft className='h-5 w-5 mr-2' />
							Back to Profile
						</Button>
					</Link>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
					{/* Main Order Details Column */}
					<div className='lg:col-span-2 space-y-8'>
						{/* Order Header Card */}
						<div className='bg-white p-6 md:p-8 rounded-xl shadow-lg'>
							<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6'>
								<h1 className='text-3xl font-bold text-slate-800 mb-2 sm:mb-0'>
									Order #{order.id?.slice(-6) || 'N/A'}
								</h1>
								<Badge
									className={`px-3 py-1.5 text-sm font-semibold border ${getStatusColor(
										order.orderStatus,
									)}`}>
									<span
										className={`w-3 h-3 rounded-full mr-2 ${getStatusPillColor(
											order.orderStatus,
										)}`}></span>
									{(order.orderStatus || 'Unknown').charAt(0).toUpperCase() +
										(order.orderStatus || 'Unknown').slice(1)}
								</Badge>
							</div>
							<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 text-sm text-slate-600'>
								<div>
									<strong className='text-slate-700'>Created:</strong>{' '}
									{formatDate(order.createdAt)}
								</div>
								<div>
									<strong className='text-slate-700'>Deadline:</strong>{' '}
									<span className='text-red-600 font-semibold'>
										{formatDate(order.deadline)}
									</span>
								</div>
								<div>
									<strong className='text-slate-700'>Total Price:</strong>{' '}
									<span className='font-semibold text-slate-800'>
										{order.total_price
											? formatCurrency(Number(order.total_price))
											: 'N/A'}
									</span>
								</div>
							</div>
						</div>

						{/* Order Information Card */}
						<div className='bg-white p-6 md:p-8 rounded-xl shadow-lg'>
							<h2 className='text-xl font-semibold text-slate-700 mb-6 border-b pb-3'>
								Order Details
							</h2>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 text-slate-600'>
								<div>
									<p className='text-xs font-medium text-slate-500 uppercase tracking-wider'>
										Subject
									</p>
									<p className='font-medium text-slate-700'>
										{order.subjectCategory || 'N/A'}
									</p>
								</div>
								<div>
									<p className='text-xs font-medium text-slate-500 uppercase tracking-wider'>
										Type
									</p>
									<p className='font-medium text-slate-700'>
										{order.typeCategory || 'N/A'}
									</p>
								</div>
								<div>
									<p className='text-xs font-medium text-slate-500 uppercase tracking-wider'>
										Academic Level
									</p>
									<p className='font-medium text-slate-700'>
										{order.academicLevel || 'N/A'}
									</p>
								</div>
								<div>
									<p className='text-xs font-medium text-slate-500 uppercase tracking-wider'>
										Pages
									</p>
									<p className='font-medium text-slate-700'>
										{order.pages || 'N/A'}
									</p>
								</div>
								<div>
									<p className='text-xs font-medium text-slate-500 uppercase tracking-wider'>
										Word Count
									</p>
									<p className='font-medium text-slate-700'>
										{order.wordCount || 'N/A'}
									</p>
								</div>
								<div>
									<p className='text-xs font-medium text-slate-500 uppercase tracking-wider'>
										Base Price
									</p>
									<p className='font-medium text-slate-700'>
										{order.price ? formatCurrency(Number(order.price)) : 'N/A'}
									</p>
								</div>
							</div>
						</div>

						{/* Description Card */}
						<div className='bg-white p-6 md:p-8 rounded-xl shadow-lg'>
							<h2 className='text-xl font-semibold text-slate-700 mb-4 border-b pb-3'>
								Project Description
							</h2>
							<div className='prose prose-slate max-w-none max-h-[300px] overflow-y-auto pr-2'>
								<p className='whitespace-pre-line text-slate-600'>
									{order.description || 'No description provided'}
								</p>
							</div>
						</div>

						{/* Files Sections in one card if present */}
						{(uploadedFileLinks.length > 0 ||
							completedFileLinks.length > 0) && (
							<div className='bg-white p-6 md:p-8 rounded-xl shadow-lg'>
								<h2 className='text-xl font-semibold text-slate-700 mb-6 border-b pb-3'>
									Associated Files
								</h2>
								<div className='space-y-6'>
									{uploadedFileLinks.length > 0 && (
										<div>
											<h3 className='text-md font-semibold text-slate-600 mb-3'>
												Your Uploaded Files
											</h3>
											<div className='p-4 bg-slate-50 rounded-lg border border-slate-200'>
												<ul className='space-y-2'>
													{uploadedFileLinks.map((url, idx) => (
														<li
															key={idx}
															className='flex items-center'>
															<FileText className='h-5 w-5 text-blue-500 mr-3 shrink-0' />
															<a
																href={url}
																target='_blank'
																rel='noopener noreferrer'
																className='text-blue-600 hover:text-blue-800 hover:underline truncate'>
																File {idx + 1}
															</a>
														</li>
													))}
												</ul>
											</div>
										</div>
									)}
									{completedFileLinks.length > 0 && (
										<div>
											<h3 className='text-md font-semibold text-slate-600 mb-3'>
												Completed Work Files
											</h3>
											<div className='p-4 bg-slate-50 rounded-lg border border-slate-200'>
												<ul className='space-y-2 mb-4'>
													{completedFileLinks.map((url, idx) => (
														<li
															key={idx}
															className='flex items-center'>
															<DownloadIcon className='h-5 w-5 text-green-500 mr-3 shrink-0' />
															<a
																href={url}
																target='_blank'
																rel='noopener noreferrer'
																className='text-green-600 hover:text-green-800 hover:underline truncate'>
																Download File {idx + 1}
															</a>
														</li>
													))}
												</ul>
												<form
													action={completedFileLinks[0] || '#'}
													method='get'
													target='_blank'>
													<Button
														type='submit'
														className='w-full bg-green-600 hover:bg-green-700 text-white'>
														<DownloadIcon className='h-4 w-4 mr-2' />
														Download All Completed Files
													</Button>
												</form>
											</div>
										</div>
									)}
								</div>
							</div>
						)}
					</div>

					{/* Sidebar Column */}
					<div className='space-y-6'>
						{/* Payment Info Card */}
						<div className='bg-white p-6 rounded-xl shadow-lg'>
							<h2 className='text-xl font-semibold text-slate-700 mb-5 border-b pb-3'>
								Payment Information
							</h2>
							<div className='space-y-4 text-sm'>
								<div>
									<p className='text-xs font-medium text-slate-500 uppercase tracking-wider mb-1'>
										Status
									</p>
									<p className='font-medium flex items-center text-slate-700'>
										{order.isPaid ? (
											<>
												<Badge
													variant='outline'
													className='border-green-300 bg-green-50 text-green-700 mr-2'>
													<Mail className='h-4 w-4 mr-1.5 text-green-500' />
													Paid
												</Badge>
												<span className='text-green-700'>
													Payment confirmed
												</span>
											</>
										) : (
											<>
												<Badge
													variant='outline'
													className='border-yellow-400 bg-yellow-50 text-yellow-700 mr-2'>
													<Mail className='h-4 w-4 mr-1.5 text-yellow-600' />
													Pending
												</Badge>
												<span className='text-yellow-700'>
													Awaiting confirmation
												</span>
											</>
										)}
									</p>
								</div>
								{order.paymentMethod && (
									<div>
										<p className='text-xs font-medium text-slate-500 uppercase tracking-wider mb-1'>
											Method
										</p>
										<p className='font-medium text-slate-700'>
											{order.paymentMethod}
										</p>
									</div>
								)}
								{order.paymentDate && (
									<div>
										<p className='text-xs font-medium text-slate-500 uppercase tracking-wider mb-1'>
											Date
										</p>
										<p className='font-medium text-slate-700'>
											{formatDate(order.paymentDate)}
										</p>
									</div>
								)}
								{!order.isPaid && (
									<div className='bg-sky-50 p-4 rounded-lg mt-4 border border-sky-200'>
										<p className='text-sm text-sky-700'>
											If you have made a payment and it&apos;s not reflected
											here, please contact customer support.
										</p>
									</div>
								)}
							</div>
						</div>

						{/* Next Steps Card */}
						<div className='bg-sky-50 p-6 rounded-xl shadow-lg border border-sky-200'>
							<div className='flex items-center mb-3'>
								<Info className='h-6 w-6 text-sky-600 mr-3 shrink-0' />
								<h2 className='text-xl font-semibold text-sky-800'>
									Next Steps
								</h2>
							</div>
							<p className='text-sm text-sky-700 leading-relaxed'>
								Once your payment is confirmed and a freelancer is assigned,
								we&apos;ll notify you via email when work begins. Our support
								team may also contact you if further details are needed.
							</p>
						</div>

						{/* Freelancer Info Card */}
						{order.freelancer && (
							<div className='bg-white p-6 rounded-xl shadow-lg'>
								<h2 className='text-xl font-semibold text-slate-700 mb-4 border-b pb-3'>
									Assigned Freelancer
								</h2>
								<div className='space-y-2 text-sm'>
									<div>
										<p className='text-xs font-medium text-slate-500 uppercase tracking-wider mb-1'>
											Name
										</p>
										<p className='font-medium text-slate-700'>{`${
											order.freelancer.firstName || ''
										} ${order.freelancer.lastName || ''}`}</p>
									</div>
								</div>
							</div>
						)}

						{/* Actions Card */}
						{order.orderStatus === 'completed' && order.freelancerId && (
							<div className='bg-white p-6 rounded-xl shadow-lg'>
								<h2 className='text-xl font-semibold text-slate-700 mb-4 border-b pb-3'>
									Actions
								</h2>
								<div className='space-y-3'>
									{!hasReview ? (
										<Link href={`/profile/orders/${order.id}/review`}>
											<Button
												className='w-full bg-amber-500 hover:bg-amber-600 text-white'
												variant='default'>
												<StarIcon className='h-4 w-4 mr-2' />
												Leave a Review
											</Button>
										</Link>
									) : (
										<div className='text-center text-sm text-slate-500 p-3 bg-slate-50 rounded-md border'>
											<StarIcon className='h-5 w-5 text-yellow-400 mx-auto mb-1.5' />
											You have already reviewed this order.
										</div>
									)}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
