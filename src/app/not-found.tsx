'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

export default function NotFound() {
	const router = useRouter();

	return (
		<div className='flex flex-col items-center justify-center min-h-[70vh] text-center px-4 py-20'>
			<span className='bg-gradient-to-b from-foreground to-transparent bg-clip-text text-[8rem] font-extrabold leading-none text-transparent'>
				404
			</span>
			<h2 className='font-heading my-2 text-2xl font-bold'>
				Something&apos;s missing
			</h2>
			<p className='max-w-md mx-auto mb-8 text-gray-600'>
				Sorry, the page you are looking for doesn&apos;t exist or has been
				moved.
			</p>
			<div className='flex flex-wrap justify-center gap-2'>
				<Button
					onClick={() => router.back()}
					variant='default'
					size='lg'>
					Go back
				</Button>
				<Button
					onClick={() => router.push('/')}
					variant='ghost'
					size='lg'>
					Back to Home
				</Button>
			</div>
		</div>
	);
}
