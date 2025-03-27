import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import db from '@/src/db';
import PricingCard from '@/components/admin/PricingCard';
import SubjectCategoriesTable from '@/components/admin/SubjectCategoriesTable';

export const metadata = {
	title: 'Service Management | Admin Dashboard',
	description: 'Manage services, pricing, and subject categories',
};

export default async function ServiceManagementPage() {
	const session = await auth();

	// Check if user is authenticated and is an admin
	if (!session?.user || session.user.role !== 'admin') {
		redirect('/');
	}

	// Fetch pricing data and subject categories from the database
	// This is a placeholder - you'll need to implement the actual data fetching
	const pricingLevels = [
		{ id: 'undergraduate', name: 'Undergraduate', basePrice: 15 },
		{ id: 'masters', name: "Master's", basePrice: 20 },
		{ id: 'phd', name: 'PhD', basePrice: 25 },
	];

	const subjectCategories = [
		{ id: 'arts', name: 'Arts & Humanities', priceModifier: 1.0 },
		{ id: 'business', name: 'Business & Economics', priceModifier: 1.1 },
		{ id: 'cs', name: 'Computer Science', priceModifier: 1.2 },
		{ id: 'em', name: 'Engineering & Mathematics', priceModifier: 1.3 },
	];

	return (
		<div className='container mx-auto py-10'>
			<div className='flex justify-between items-center mb-10'>
				<h1 className='text-3xl font-bold'>Service Management</h1>
				<Button asChild>
					<Link href='/dashboard/services/new'>
						<PlusCircle className='mr-2 h-4 w-4' />
						Add New Subject
					</Link>
				</Button>
			</div>

			<div className='mb-10'>
				<h2 className='text-2xl font-semibold mb-5'>Pricing Levels</h2>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
					{pricingLevels.map((level) => (
						<PricingCard
							key={level.id}
							id={level.id}
							name={level.name}
							basePrice={level.basePrice}
						/>
					))}
				</div>
			</div>

			<div>
				<h2 className='text-2xl font-semibold mb-5'>Subject Categories</h2>
				<SubjectCategoriesTable categories={subjectCategories} />
			</div>
		</div>
	);
}
