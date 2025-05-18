import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import FreelancerForm from '@/src/components/admin/FreelancerForm';

const metadata = {
	title: 'Register Freelancer | Admin Dashboard',
	description: 'Register new freelancers to work on academic assignments.',
};

const checkSession = async () => {
	const session = await auth();
	if (!session?.user || session.user.role !== 'admin') {
		redirect('/');
	}
};
export default function RegisterFreelancerPage() {
	checkSession();

	return (
		<div className='container mx-auto py-10'>
			<div className='flex flex-col gap-6 max-w-4xl mx-auto'>
				<div className='flex items-center justify-between'>
					<h1 className='text-2xl font-bold'>Register New Freelancer</h1>
				</div>

				<div className='bg-white rounded-lg shadow-md p-6'>
					<p className='text-gray-500 mb-6'>
						Create a new freelancer account. The freelancer will be able to
						login with these credentials and will be assigned to orders that
						need to be completed.
					</p>

					<FreelancerForm />
				</div>
			</div>
		</div>
	);
}
