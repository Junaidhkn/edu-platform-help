import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import NewAcademicLevelForm from '@/src/components/admin/NewAcademicLevelForm';

export const metadata = {
	title: 'Add Academic Level | Admin Dashboard',
	description: 'Add a new academic level',
};

export default async function NewAcademicLevelPage() {
	const session = await auth();

	// Check if user is authenticated and is an admin
	if (!session?.user || session.user.role !== 'admin') {
		redirect('/');
	}

	return (
		<div className='container mx-auto py-10 max-w-2xl'>
			<div className='flex flex-col space-y-6'>
				<div className='flex justify-between items-center'>
					<h1 className='text-3xl font-bold'>Add New Academic Level</h1>
					<Link
						href='/dashboard/services'
						className='text-sm text-blue-600 hover:text-blue-800'>
						Back to Services
					</Link>
				</div>

				<div className='border rounded-lg p-6 bg-white shadow-sm'>
					<NewAcademicLevelForm />
				</div>
			</div>
		</div>
	);
}
