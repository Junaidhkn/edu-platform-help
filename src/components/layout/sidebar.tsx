'use client';
import DashboardNav from '@/src/components/dashboard-nav';
import { navItems } from '@/constants/data';
import { useSidebar } from '@/hooks/useSidebar';
import { cn } from '@/src/lib/utils';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

type SidebarProps = {
	className?: string;
};

export default function Sidebar({ className }: SidebarProps) {
	const { isMinimized, toggle } = useSidebar();
	const [isOpen, setIsOpen] = useState(true);

	const handleToggle = () => {
		toggle();
		setIsOpen(!isOpen);
	};

	return (
		<aside
			className={cn(
				`relative h-screen flex-none border-r bg-card transition-[width] duration-500 block`,
				!isMinimized ? 'w-72' : 'w-[72px]',
				className,
			)}>
			<ChevronLeft
				className={cn(
					'absolute -right-3 top-10 z-50 cursor-pointer rounded-full border bg-background text-3xl text-foreground',
					isMinimized && 'rotate-180',
				)}
				onClick={handleToggle}
			/>
			<div className='space-y-4 py-4'>
				<div className='px-3 py-2'>
					<div className='mt-3 space-y-1'>
						<DashboardNav items={navItems} />
					</div>
				</div>
			</div>
		</aside>
	);
}
