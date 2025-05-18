'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ReviewForm } from '@/src/components/ReviewForm';

interface ReviewFormWrapperProps {
	orderId: string;
	freelancerId: string;
	freelancerName: string;
}

export default function ReviewFormWrapper({
	orderId,
	freelancerId,
	freelancerName,
}: ReviewFormWrapperProps) {
	const router = useRouter();

	const handleReviewSuccess = () => {
		toast.success('Review submitted successfully');
		router.push(`/profile/orders/${orderId}`);
	};

	return (
		<ReviewForm
			orderId={orderId}
			freelancerId={freelancerId}
			freelancerName={freelancerName}
			onSuccess={handleReviewSuccess}
		/>
	);
}
