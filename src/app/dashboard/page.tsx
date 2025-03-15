import OverViewPageView from '@/sections/overview/view/overview';
import { CreateAdminButton } from '@/components/admin/CreateAdminButton';

export const metadata = {
	title: 'Dashboard : Admin Overview',
};

export default function DashboardPage() {
	// Admin check happens at the layout level
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
