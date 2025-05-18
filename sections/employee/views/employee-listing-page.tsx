import { Breadcrumbs } from '@/src/components/breadcrumbs';
import PageContainer from '@/src/components/layout/page-container';
import EmployeeTable from '../employee-tables';
import { buttonVariants } from '@/src/components/ui/button';
import { Heading } from '@/src/components/ui/heading';
import { Separator } from '@/src/components/ui/separator';
import { Employee } from '@/constants/data';
import { fakeUsers } from '@/constants/mock-api';
import { searchParamsCache } from '@/src/lib/searchparams';
import { cn } from '@/src/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';

const breadcrumbItems = [
	{ title: 'Dashboard', link: '/dashboard' },
	{ title: 'Employee', link: '/dashboard/employee' },
];

type TEmployeeListingPage = {};

export default async function EmployeeListingPage({}: TEmployeeListingPage) {
	// Showcasing the use of search params cache in nested RSCs
	const page = searchParamsCache.get('page');
	const search = searchParamsCache.get('q');
	const gender = searchParamsCache.get('gender');
	const pageLimit = searchParamsCache.get('limit');

	const filters = {
		page,
		limit: pageLimit,
		...(search && { search }),
		...(gender && { genders: gender }),
	};

	// mock api call
	const data = await fakeUsers.getUsers(filters);
	const totalUsers = data.total_users;
	const employee: Employee[] = data.users;

	return (
		<PageContainer>
			<div className='space-y-4'>
				<Breadcrumbs items={breadcrumbItems} />

				<div className='flex items-start justify-between'>
					<Heading
						title={`Employee (${totalUsers})`}
						description='Manage employees (Server side table functionalities.)'
					/>

					<Link
						href={'/dashboard/employee/new'}
						className={cn(buttonVariants({ variant: 'default' }))}>
						<Plus className='mr-2 h-4 w-4' /> Add New
					</Link>
				</div>
				<Separator />
				<EmployeeTable
					data={employee}
					totalData={totalUsers}
				/>
			</div>
		</PageContainer>
	);
}
