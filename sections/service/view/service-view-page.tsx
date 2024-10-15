import { Breadcrumbs } from '@/components/breadcrumbs';
import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react';
import serviceForm from '../service-form';

const breadcrumbItems = [
	{ title: 'Dashboard', link: '/dashboard' },
	{ title: 'service', link: '/dashboard/service' },
	{ title: 'Create', link: '/dashboard/service/create' },
];

export default function serviceViewPage() {
	return (
		<ScrollArea className='h-full'>
			<div className='flex-1 space-y-4 p-8'>
				<Breadcrumbs items={breadcrumbItems} />
				<serviceForm />
			</div>
		</ScrollArea>
	);
}
