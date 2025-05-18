import { Breadcrumbs } from '@/src/components/breadcrumbs';
import { ScrollArea } from '@/src/components/ui/scroll-area';
import EmployeeForm from '../employee-form';

const breadcrumbItems = [
	{ title: 'Dashboard', link: '/dashboard' },
	{ title: 'Employee', link: '/dashboard/employee' },
	{ title: 'Create', link: '/dashboard/employee/create' },
];

export default function EmployeeViewPage() {
	return (
		<ScrollArea className='h-full'>
			<div className='flex-1 space-y-4 p-8'>
				<Breadcrumbs items={breadcrumbItems} />
				<EmployeeForm />
			</div>
		</ScrollArea>
	);
}
