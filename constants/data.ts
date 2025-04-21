import { NavItem } from '@/types';


export const navItems: NavItem[] = [
	{
		title: 'Dashboard',
		href: '/dashboard',
		icon: 'dashboard',
		label: 'Dashboard',
	},
	{
		title: 'Freelancers',
		href: '/dashboard/freelancer',
		icon: 'user',
		label: 'freelancer',
	},
	{
		title: 'Create Profiles',
		href: '/dashboard/profile',
		icon: 'userPen',
		label: 'profile',
	},

	{
		title: 'Services',
		href: '/dashboard/services',
		label: 'services',
	},
	{
		title: 'Transactions',
		href: '/dashboard/transactions',
		label: 'transactions',
		icon: 'money',
	},
	{
		title: 'Submissions',
		href: '/dashboard/submissions',
		label: 'submissions',
		icon: 'file',
	},
];
