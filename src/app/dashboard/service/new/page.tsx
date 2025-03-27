import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import NewSubjectForm from '@/components/admin/NewSubjectForm';

export const metadata = {
	title: 'Add New Subject | Admin Dashboard',
	description: 'Add a new subject category',
};

export default async function NewSubjectPage() {
	const session = await auth();

	console.log('session info', session?.user?.role);
	// Check if user is authenticated and is an admin
	if (!session?.user || session.user.role !== 'admin') {
		redirect('/');
	}

	return (
		<div className='container mx-auto py-10 max-w-2xl'>
			<div className='flex flex-col space-y-6'>
				<div className='flex justify-between items-center'>
					<h1 className='text-3xl font-bold'>Add New Subject Category</h1>
					<Link
						href='/dashboard/services'
						className='text-sm text-blue-600 hover:text-blue-800'>
						Back to Services
					</Link>
				</div>

				<div className='border rounded-lg p-6 bg-white shadow-sm'>
					<NewSubjectForm />
				</div>
			</div>
		</div>
	);
}
