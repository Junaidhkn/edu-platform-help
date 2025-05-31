'use client';
import Link from 'next/link';
import { NavbarLinks } from './navbar-links';
import { FaGraduationCap } from 'react-icons/fa';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);

	const handleClose = () => setIsOpen(false);

	return (
		<nav className='sticky top-0 z-50 bg-white shadow-sm h-16 border-b'>
			<div className='w-full max-w-7xl mx-auto h-full flex items-center justify-between px-4'>
				<h3 className='text-xl font-bold tracking-tight flex items-center gap-2'>
					<FaGraduationCap className='text-purple-600 text-2xl' />
					<Link
						href='/'
						className='text-purple-700 hover:text-purple-800 transition-colors'>
						Top Nerd
					</Link>
				</h3>

				{/* Desktop menu */}
				<style jsx>{`
					@media (min-width: 768px) {
						.desktop-menu {
							display: flex !important;
						}
					}
				`}</style>
				<div className='hidden desktop-menu items-center gap-x-6 relative z-10'>
					<NavbarLinks onClick={handleClose} />
				</div>

				{/* Hamburger button */}
				<button
					className='md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors'
					onClick={() => setIsOpen((prev) => !prev)}
					aria-label={isOpen ? 'Close menu' : 'Open menu'}>
					{isOpen ? (
						<X className='h-6 w-6 text-gray-700' />
					) : (
						<Menu className='h-6 w-6 text-gray-700' />
					)}
				</button>
			</div>

			{/* Mobile menu overlay */}
			{isOpen && (
				<div className='fixed inset-0 top-16 bg-white z-50 flex flex-col p-6 space-y-4 md:hidden shadow-lg'>
					<div className='flex flex-col gap-4'>
						<NavbarLinks onClick={handleClose} />
					</div>
				</div>
			)}
		</nav>
	);
};
