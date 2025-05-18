'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import Link from 'next/link';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/src/components/ui/table';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Eye, Upload } from 'lucide-react';

interface Order {
	id: string;
	deadline: string;
	typeCategory: string;
	subjectCategory: string;
	wordCount: number;
	description: string;
	academicLevel: string;
	orderStatus: string;
	createdAt: string;
	user: {
		name: string | null;
		email: string | null;
	};
}

interface FreelancerOrdersTableProps {
	orders: Order[];
}

export default function FreelancerOrdersTable({
	orders,
}: FreelancerOrdersTableProps) {
	// Function to determine status color
	const getStatusColor = (status: string) => {
		switch (status) {
			case 'accepted':
				return 'bg-green-100 text-green-800';
			case 'completed':
				return 'bg-blue-100 text-blue-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	// Function to format the deadline
	const formatDeadline = (dateString: string) => {
		return format(new Date(dateString), 'MMM dd, yyyy');
	};

	// Function to truncate text
	const truncateText = (text: string, maxLength: number = 50) => {
		if (text.length <= maxLength) return text;
		return text.slice(0, maxLength) + '...';
	};

	return (
		<div className='rounded-md border'>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Order ID</TableHead>
						<TableHead>Subject</TableHead>
						<TableHead>Type</TableHead>
						<TableHead>Academic Level</TableHead>
						<TableHead>Deadline</TableHead>
						<TableHead>Status</TableHead>
						<TableHead className='text-right'>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{orders.map((order) => (
						<TableRow key={order.id}>
							<TableCell className='font-medium'>
								{order.id.substring(0, 8)}...
							</TableCell>
							<TableCell>{order.subjectCategory}</TableCell>
							<TableCell>{order.typeCategory}</TableCell>
							<TableCell>{order.academicLevel}</TableCell>
							<TableCell>{formatDeadline(order.deadline)}</TableCell>
							<TableCell>
								<Badge
									variant='outline'
									className={getStatusColor(order.orderStatus)}>
									{order.orderStatus}
								</Badge>
							</TableCell>
							<TableCell className='text-right'>
								<div className='flex justify-end space-x-2'>
									<Link href={`/freelancer/orders/${order.id}`}>
										<Button
											variant='outline'
											size='sm'>
											<Eye className='h-4 w-4 mr-1' />
											View
										</Button>
									</Link>
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
