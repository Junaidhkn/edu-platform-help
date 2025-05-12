import Link from 'next/link';
const Footer = () => {
	return (
		<footer className='w-full py-10 bg-gray-900 text-gray-300'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6'>
				<div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
					<div>
						<h3 className='text-xl font-bold text-white mb-4'>Top Nerd</h3>
						<p className='text-gray-400'>
							Your trusted platform for academic excellence and freelance
							opportunities.
						</p>
					</div>

					<div>
						<h4 className='text-lg font-semibold text-white mb-4'>Services</h4>
						<ul className='space-y-2'>
							<li>
								<Link
									href='/services'
									className='hover:text-white'>
									Assignment Help
								</Link>
							</li>
							<li>
								<Link
									href='/services'
									className='hover:text-white'>
									Programming Projects
								</Link>
							</li>
							<li>
								<Link
									href='/services'
									className='hover:text-white'>
									Data Analysis
								</Link>
							</li>
							<li>
								<Link
									href='/services'
									className='hover:text-white'>
									Research Papers
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h4 className='text-lg font-semibold text-white mb-4'>Company</h4>
						<ul className='space-y-2'>
							<li>
								<Link
									href='#'
									className='hover:text-white'>
									About Us
								</Link>
							</li>
							<li>
								<Link
									href='/#how-it-works'
									className='hover:text-white'>
									How It Works
								</Link>
							</li>
							<li>
								<Link
									href='#'
									className='hover:text-white'>
									Testimonials
								</Link>
							</li>
							<li>
								<Link
									href='#'
									className='hover:text-white'>
									Contact Us
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h4 className='text-lg font-semibold text-white mb-4'>Legal</h4>
						<ul className='space-y-2'>
							<li>
								<Link
									href='/legal#terms-of-service'
									className='hover:text-white'>
									Terms of Service
								</Link>
							</li>
							<li>
								<Link
									href='/legal#privacy-policy'
									className='hover:text-white'>
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link
									href='/legal#academic-integrity'
									className='hover:text-white'>
									Academic Integrity
								</Link>
							</li>
							<li>
								<Link
									href='/legal#refund-policy'
									className='hover:text-white'>
									Refund Policy
								</Link>
							</li>
						</ul>
					</div>
				</div>

				<div className='border-t border-gray-800 mt-10 pt-8 text-center text-gray-400'>
					<p>
						&copy; {new Date().getFullYear()} Top Nerd. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
