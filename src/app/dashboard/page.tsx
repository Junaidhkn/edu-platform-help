import OverViewPageView from '@/sections/overview/view/overview';
import { CreateAdminButton } from '@/components/admin/CreateAdminButton';
import { initializeAdminUser } from '@/src/lib/admin/init-admin';

export const metadata = {
	title: 'Dashboard : Overview',
};

export default async function DashboardPage() {
	// Ensure admin is initialized
	await initializeAdminUser();
	
	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center p-4 bg-muted rounded-lg">
				<h2 className="text-xl font-semibold">Admin Controls</h2>
				<CreateAdminButton />
			</div>
			<OverViewPageView />
		</div>
	);
}
