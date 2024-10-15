import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import serviceTable from '../service-tables';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { service } from '@/constants/data';
import { fakeservices } from '@/constants/mock-api';
import { searchParamsCache } from '@/lib/searchparams';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import type { SearchParams } from 'nuqs/server';

const breadcrumbItems = [
	{ title: 'Dashboard', link: '/dashboard' },
	{ title: 'services', link: '/dashboard/service' },
];

type serviceListingPage = {};

export default async function serviceListingPage({}: serviceListingPage) {
	// Showcasing the use of search params cache in nested RSCs
	const page = searchParamsCache.get('page');
	const search = searchParamsCache.get('q');
	const pageLimit = searchParamsCache.get('limit');
	const categories = searchParamsCache.get('categories');

	const filters = {
		page,
		limit: pageLimit,
		...(search && { search }),
		...(categories && { categories: categories }),
	};

	const data = await fakeservices.getservices(filters);
	const totalservices = data.total_services;
	const services: service[] = data.services;

	return (
		<PageContainer>
			<div className='space-y-4'>
				<Breadcrumbs items={breadcrumbItems} />
				<div className='flex items-start justify-between'>
					<Heading
						title={`services (${totalservices})`}
						description='Manage services (Server side table functionalities.)'
					/>
					<Link
						href={'/dashboard/service/new'}
						className={cn(buttonVariants(), 'text-xs md:text-sm')}>
						<Plus className='mr-2 h-4 w-4' /> Add New
					</Link>
				</div>
				<Separator />
				<serviceTable
					data={services}
					totalData={totalservices}
				/>
			</div>
		</PageContainer>
	);
}
