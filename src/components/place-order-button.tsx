'use client';

import { Button } from '@/src/components/ui/button';
import { useRouter } from 'next/navigation';
import { PlusCircle } from 'lucide-react';

export function PlaceOrderButton() {
	const router = useRouter();

	return (
		<Button
			onClick={() => router.push('/profile/place-order')}
			size='lg'
			className='gap-2'>
			<PlusCircle className='h-4 w-4' />
			Place an Order
		</Button>
	);
}
