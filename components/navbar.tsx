import Link from 'next/link';
import { NavbarLinks } from './navbar-links';
import { FaGraduationCap } from 'react-icons/fa';

export const Navbar = () => {
	return (
		<nav className='sticky top-0 z-50 bg-white shadow-sm h-16 border-b'>
			<div className='container h-full flex items-center justify-between'>
				<h3 className='text-xl font-bold tracking-tight flex items-center gap-2'>
					<FaGraduationCap className='text-purple-600 text-2xl' />
					<Link
						href='/'
						className='text-purple-700 hover:text-purple-800 transition-colors'>
						Top Nerd
					</Link>
				</h3>

				<ul className='flex items-center gap-x-6'>
					<NavbarLinks />
				</ul>
			</div>
		</nav>
	);
};
