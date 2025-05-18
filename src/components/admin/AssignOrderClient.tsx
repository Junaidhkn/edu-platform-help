'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import FreelancerTable, {
	Freelancer,
} from '@/src/components/admin/FreelancerTable';

interface AssignOrderClientProps {
	orderId: string;
	freelancers: Freelancer[]; // Use the type exported from FreelancerTable or define it here
}

export default function AssignOrderClient({
	orderId,
	freelancers,
}: AssignOrderClientProps) {
	const router = useRouter();
	const [isAssigning, setIsAssigning] = useState<string | null>(null); // Store the ID of the freelancer being assigned

	const handleAssignOrder = async (freelancerId: string) => {
		setIsAssigning(freelancerId);
		try {
			const response = await fetch('/api/orders/assign', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					orderId: orderId,
					freelancerId,
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || 'Failed to assign order');
			}

			toast.success('Order assigned successfully');
			router.push(`/dashboard/orders/${orderId}`);
			router.refresh(); // Optional: Refresh server component data
		} catch (error) {
			console.error('Error assigning order:', error);
			toast.error(
				error instanceof Error ? error.message : 'Failed to assign order',
			);
		} finally {
			setIsAssigning(null);
		}
	};

	return (
		<FreelancerTable
			freelancers={freelancers}
			onAssignOrder={handleAssignOrder}
			isAssigningId={isAssigning}
		/>
	);
}

// Define Freelancer type if not imported
// export interface Freelancer {
//   id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   rating?: number;
//   skills: string;
//   createdAt: string;
// }
