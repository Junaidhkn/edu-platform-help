import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/src/components/ui/button';
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@/src/components/ui/tabs';
import db from '@/src/db/index';
import {
	academicLevels,
	subjectCategories,
	assignmentTypes,
} from '@/src/db/schema';
import { AcademicLevelsTable } from '@/src/components/admin/AcademicLevelsTable';
import { CategoriesTable } from '@/src/components/admin/CategoriesTable';
import AssignmentTypesTable from '@/src/components/admin/AssignmentTypesTable';
import { desc, asc } from 'drizzle-orm';

export const metadata = {
	title: 'Services Management | Admin Dashboard',
	description:
		'Manage academic levels, subject categories, and assignment types.',
};

export default async function ServiceManagementPage() {
	const session = await auth();

	if (!session || session.user?.role !== 'admin') {
		redirect('/login');
	}

	// Fetch data from the database
	const academicLevelsList = await db
		.select()
		.from(academicLevels)
		.orderBy(asc(academicLevels.name));
	const categoriesList = await db
		.select()
		.from(subjectCategories)
		.orderBy(asc(subjectCategories.name));
	const assignmentTypesRaw = await db
		.select()
		.from(assignmentTypes)
		.orderBy(asc(assignmentTypes.name));

	// Convert priceAdjustment from string to number
	const assignmentTypesList = assignmentTypesRaw.map((type) => ({
		...type,
		priceAdjustment: Number(type.priceAdjustment),
	}));

	return (
		<div className='flex flex-col gap-6 max-w-[80%] mx-auto p-4'>
			<div className='flex items-center justify-between'>
				<h1 className='text-2xl font-bold tracking-tight'>
					Services Management
				</h1>
			</div>

			<Tabs
				defaultValue='academic-levels'
				className='w-full'>
				<TabsList className='grid w-full grid-cols-3'>
					<TabsTrigger value='academic-levels'>
						Academic Levels & Pricing
					</TabsTrigger>
					<TabsTrigger value='categories'>Subject Categories</TabsTrigger>
					<TabsTrigger value='assignment-types'>Assignment Types</TabsTrigger>
				</TabsList>

				<TabsContent
					value='academic-levels'
					className='space-y-4'>
					<div className='flex justify-end'>
						<Link href='/dashboard/services/academic-levels/new'>
							<Button>
								<PlusCircle className='mr-2 h-4 w-4' />
								Add Academic Level
							</Button>
						</Link>
					</div>
					<AcademicLevelsTable academicLevels={academicLevelsList} />
				</TabsContent>

				<TabsContent
					value='categories'
					className='space-y-4'>
					<div className='flex justify-end'>
						<Link href='/dashboard/services/categories/new'>
							<Button>
								<PlusCircle className='mr-2 h-4 w-4' />
								Add Subject Category
							</Button>
						</Link>
					</div>
					<CategoriesTable categories={categoriesList} />
				</TabsContent>

				<TabsContent
					value='assignment-types'
					className='space-y-4'>
					<div className='flex justify-end'>
						<Link href='/dashboard/services/assignment-types/new'>
							<Button>
								<PlusCircle className='mr-2 h-4 w-4' />
								Add Assignment Type
							</Button>
						</Link>
					</div>
					<AssignmentTypesTable assignmentTypes={assignmentTypesList} />
				</TabsContent>
			</Tabs>
		</div>
	);
}
