import Link from 'next/link';
import {
	FaGraduationCap,
	FaLaptopCode,
	FaCheckCircle,
	FaStar,
	FaChartLine,
} from 'react-icons/fa';
import { BsArrowRight } from 'react-icons/bs';
import Image from 'next/image';
import HomeImage from '@/public/images/assignment-hero.svg';

export default function Home() {
	return (
		<main className='flex flex-col items-center min-h-screen'>
			{/* Hero Section */}
			<section className='w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28 flex flex-col md:flex-row items-center'>
					<div className='md:w-1/2 mb-10 md:mb-0 space-y-6'>
						<h1 className='text-4xl md:text-5xl font-bold leading-tight'>
							Excellence in Academic Solutions
						</h1>
						<p className='text-lg md:text-xl opacity-90'>
							Connect with top-tier freelancers for all your assignment needs.
							Quality work, on time, every time.
						</p>
						<div className='pt-4 flex flex-col sm:flex-row gap-4'>
							<Link
								href='/auth/signup'
								className='bg-white text-purple-700 hover:bg-opacity-90 font-semibold rounded-lg px-6 py-3 text-center'>
								Get Started
							</Link>
						</div>
					</div>
					<div className='md:w-1/2 flex justify-center'>
						<Image
							src={HomeImage}
							alt='Top Nerd Assignment Help'
							className='max-w-md w-full'
							width={300}
							height={300}
						/>
					</div>
				</div>
			</section>

			{/* Services Section */}
			<section className='w-full py-20 bg-gray-50'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6'>
					<div className='text-center mb-16'>
						<h2 className='text-3xl md:text-4xl font-bold text-gray-900'>
							Our Services
						</h2>
						<p className='mt-4 text-xl text-gray-600'>
							Expert solutions for all your academic needs
						</p>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
						<div className='bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow'>
							<div className='w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4'>
								<FaGraduationCap className='text-purple-600 text-xl' />
							</div>
							<h3 className='text-xl font-semibold mb-3'>Assignment Help</h3>
							<p className='text-gray-600 mb-4'>
								Expert assistance with essays, research papers, case studies,
								and more.
							</p>
							<Link
								href='/services'
								className='inline-flex items-center text-purple-600 font-medium'>
								Learn more <BsArrowRight className='ml-2' />
							</Link>
						</div>

						<div className='bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow'>
							<div className='w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4'>
								<FaLaptopCode className='text-indigo-600 text-xl' />
							</div>
							<h3 className='text-xl font-semibold mb-3'>
								Programming Projects
							</h3>
							<p className='text-gray-600 mb-4'>
								Coding solutions in various languages from experienced
								developers.
							</p>
							<Link
								href='/services'
								className='inline-flex items-center text-indigo-600 font-medium'>
								Learn more <BsArrowRight className='ml-2' />
							</Link>
						</div>

						<div className='bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow'>
							<div className='w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-4'>
								<FaChartLine className='text-pink-600 text-xl' />
							</div>
							<h3 className='text-xl font-semibold mb-3'>Data Analysis</h3>
							<p className='text-gray-600 mb-4'>
								Statistical analysis, data visualization, and research
								methodology support.
							</p>
							<Link
								href='/services'
								className='inline-flex items-center text-pink-600 font-medium'>
								Learn more <BsArrowRight className='ml-2' />
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* How It Works */}
			<section
				id='how-it-works'
				className='w-full py-20'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6'>
					<div className='text-center mb-16'>
						<h2 className='text-3xl md:text-4xl font-bold text-gray-900'>
							How Top Nerd Works
						</h2>
						<p className='mt-4 text-xl text-gray-600'>
							Simple steps to get your work done
						</p>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
						<div className='text-center'>
							<div className='w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold'>
								1
							</div>
							<h3 className='text-xl font-semibold mb-3'>Sign Up</h3>
							<p className='text-gray-600'>
								Create your account to access our platform and services.
							</p>
						</div>

						<div className='text-center'>
							<div className='w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold'>
								2
							</div>
							<h3 className='text-xl font-semibold mb-3'>Chat with Support</h3>
							<p className='text-gray-600'>
								Discuss your project requirements with our customer service
								team.
							</p>
						</div>

						<div className='text-center'>
							<div className='w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold'>
								3
							</div>
							<h3 className='text-xl font-semibold mb-3'>Place Your Order</h3>
							<p className='text-gray-600'>
								Once satisfied with the requirements, proceed to place your
								order.
							</p>
						</div>

						<div className='text-center'>
							<div className='w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold'>
								4
							</div>
							<h3 className='text-xl font-semibold mb-3'>
								Receive Quality Work
							</h3>
							<p className='text-gray-600'>
								Get your completed assignment delivered on time with guaranteed
								satisfaction.
							</p>
						</div>
					</div>

					<div className='mt-12 text-center'>
						<Link
							href='/auth/signup'
							className='inline-flex items-center bg-purple-600 text-white font-semibold rounded-lg px-6 py-3 hover:bg-purple-700'>
							Get Started Now
						</Link>
					</div>
				</div>
			</section>

			{/* Testimonials */}
			<section className='w-full py-20 bg-gray-50'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6'>
					<div className='text-center mb-16'>
						<h2 className='text-3xl md:text-4xl font-bold text-gray-900'>
							What Students Say
						</h2>
						<p className='mt-4 text-xl text-gray-600'>
							Trusted by thousands of students worldwide
						</p>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
						<div className='bg-white p-6 rounded-xl shadow-md'>
							<div className='flex text-yellow-400 mb-3'>
								<FaStar />
								<FaStar />
								<FaStar />
								<FaStar />
								<FaStar />
							</div>
							<p className='text-gray-600 mb-4'>
								&quot;The programming assignment I received was excellent. Clean
								code, well-documented, and delivered before the deadline. Highly
								recommended!&quot;
							</p>
							<div className='flex items-center'>
								<div className='w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center mr-3'>
									<span className='text-purple-700 font-semibold'>JM</span>
								</div>
								<div>
									<p className='font-semibold'>James Miller</p>
									<p className='text-sm text-gray-500'>
										Computer Science Student
									</p>
								</div>
							</div>
						</div>

						<div className='bg-white p-6 rounded-xl shadow-md'>
							<div className='flex text-yellow-400 mb-3'>
								<FaStar />
								<FaStar />
								<FaStar />
								<FaStar />
								<FaStar />
							</div>
							<p className='text-gray-600 mb-4'>
								&quot;Top Nerd saved me when I was overwhelmed with multiple
								assignments. The work quality was outstanding and helped me
								improve my own understanding.&quot;
							</p>
							<div className='flex items-center'>
								<div className='w-10 h-10 bg-indigo-200 rounded-full flex items-center justify-center mr-3'>
									<span className='text-indigo-700 font-semibold'>SJ</span>
								</div>
								<div>
									<p className='font-semibold'>Sarah Johnson</p>
									<p className='text-sm text-gray-500'>Business Major</p>
								</div>
							</div>
						</div>

						<div className='bg-white p-6 rounded-xl shadow-md'>
							<div className='flex text-yellow-400 mb-3'>
								<FaStar />
								<FaStar />
								<FaStar />
								<FaStar />
								<FaStar />
							</div>
							<p className='text-gray-600 mb-4'>
								&quot;I was skeptical at first, but the data analysis help I
								received was phenomenal. The freelancer explained everything in
								detail and delivered great work.&quot;
							</p>
							<div className='flex items-center'>
								<div className='w-10 h-10 bg-pink-200 rounded-full flex items-center justify-center mr-3'>
									<span className='text-pink-700 font-semibold'>DT</span>
								</div>
								<div>
									<p className='font-semibold'>David Thompson</p>
									<p className='text-sm text-gray-500'>Statistics Major</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className='w-full py-16 bg-purple-700 text-white'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 text-center'>
					<h2 className='text-3xl md:text-4xl font-bold mb-6'>
						Ready to Excel in Your Studies?
					</h2>
					<p className='text-xl mb-8 max-w-3xl mx-auto'>
						Join thousands of students who trust Top Nerd for high-quality
						academic assistance and programming solutions.
					</p>
					<div className='flex flex-col sm:flex-row justify-center gap-4'>
						<Link
							href='/auth/signup'
							className='bg-white text-purple-700 hover:bg-opacity-90 font-semibold rounded-lg px-6 py-3'>
							Submit an Assignment
						</Link>
					</div>
				</div>
			</section>
		</main>
	);
}
