import Link from 'next/link';
import {
	FaGraduationCap,
	FaLaptopCode,
	FaStar,
	FaChartLine,
} from 'react-icons/fa';
import { BsArrowRight } from 'react-icons/bs';
import Image from 'next/image';
import HomeImage from '@/public/images/assignment-hero.svg';
import TestimonialSlider from '@/src/components/TestimonialSlider';

export default function Home() {
	return (
		<main className='flex flex-col items-center min-h-screen bg-slate-50'>
			{/* Hero Section */}
			<section className='w-full bg-gradient-to-br from-slate-900 via-purple-900 to-violet-800 text-white'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 lg:py-16'>
					<div className='flex flex-col-reverse lg:flex-row items-center justify-between gap-8 lg:gap-12'>
						<div className='w-full lg:w-1/2 space-y-4 md:space-y-6 text-center lg:text-left'>
							<h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight leading-tight'>
								Unlock Your Academic Potential
							</h1>
							<p className='text-sm sm:text-base md:text-lg lg:text-xl opacity-90 max-w-xl mx-auto lg:mx-0'>
								Premium academic solutions and expert freelance support,
								tailored for your success.
							</p>
							<div className='flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start'>
								<Link
									href='/auth/signup'
									className='bg-white text-center text-purple-700 hover:bg-purple-50 font-bold rounded-lg px-4 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base shadow-lg transform hover:scale-105 transition-all duration-300'>
									Get Started Today
								</Link>
								<Link
									href='#how-it-works'
									className='bg-transparent text-center border-2 border-white text-white hover:bg-white/10 font-bold rounded-lg px-4 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base shadow-lg transform hover:scale-105 transition-all duration-300'>
									Learn How It Works
								</Link>
							</div>
						</div>
						<div className='w-full lg:w-1/2 flex justify-center items-center mt-6 lg:mt-0'>
							<Image
								src={HomeImage}
								alt='Academic Success Hero Image'
								className='w-full max-w-[280px] sm:max-w-sm md:max-w-md lg:max-w-lg rounded-lg shadow-2xl'
								width={500}
								height={500}
								priority
							/>
						</div>
					</div>
				</div>
			</section>

			{/* Services Section */}
			<section className='w-full py-12 md:py-16 lg:py-20 bg-white'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6'>
					<div className='text-center mb-12 md:mb-16'>
						<h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900'>
							Our Premier Services
						</h2>
						<p className='mt-4 text-base sm:text-lg text-gray-700 max-w-2xl mx-auto'>
							From complex assignments to coding projects, we provide expert
							solutions.
						</p>
					</div>

					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'>
						{[
							{
								icon: FaGraduationCap,
								title: 'Assignment Help',
								description:
									'Expert assistance with essays, research papers, case studies, and more, ensuring top grades.',
								color: 'purple',
							},
							{
								icon: FaLaptopCode,
								title: 'Programming Projects',
								description:
									'Custom coding solutions in various languages from seasoned developers and programmers.',
								color: 'indigo',
							},
							{
								icon: FaChartLine,
								title: 'Data Analysis',
								description:
									'In-depth statistical analysis, data visualization, and comprehensive research support.',
								color: 'pink',
							},
						].map((service) => (
							<div
								key={service.title}
								className='bg-slate-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center'>
								<div
									className={`w-14 h-14 bg-${service.color}-100 rounded-full flex items-center justify-center mb-4 ring-4 ring-${service.color}-200`}>
									<service.icon
										className={`text-${service.color}-600 text-2xl`}
									/>
								</div>
								<h3 className='text-xl font-semibold mb-3 text-slate-900'>
									{service.title}
								</h3>
								<p className='text-gray-600 mb-4 flex-grow'>
									{service.description}
								</p>
								<Link
									href='/services'
									className={`inline-flex items-center text-${service.color}-600 font-semibold hover:text-${service.color}-800 transition-colors duration-300 group`}>
									Explore Service{' '}
									<BsArrowRight className='ml-2 transform group-hover:translate-x-1 transition-transform duration-300' />
								</Link>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* How It Works */}
			<section
				id='how-it-works'
				className='w-full py-12 md:py-16 lg:py-20 bg-slate-100'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6'>
					<div className='text-center mb-12 md:mb-16'>
						<h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900'>
							Simple Steps to Success
						</h2>
						<p className='mt-4 text-base sm:text-lg text-gray-700 max-w-2xl mx-auto'>
							Getting started with Top Nerd is quick, easy, and transparent.
						</p>
					</div>

					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8'>
						{[
							{
								step: 1,
								title: 'Sign Up & Connect',
								description:
									'Create your account in minutes and connect with our supportive platform.',
							},
							{
								step: 2,
								title: 'Detail Your Needs',
								description:
									'Clearly outline your project requirements and chat with our team for any clarifications.',
							},
							{
								step: 3,
								title: 'Secure Your Order',
								description:
									'Confirm your details, make a secure payment, and let our experts get to work.',
							},
							{
								step: 4,
								title: 'Receive Excellence',
								description:
									'Get your high-quality, plagiarism-free work delivered on time, every time.',
							},
						].map((item) => (
							<div
								key={item.step}
								className='bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-center flex flex-col items-center'>
								<div className='w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold ring-4 ring-purple-200'>
									{item.step}
								</div>
								<h3 className='text-xl font-semibold mb-2 text-slate-900'>
									{item.title}
								</h3>
								<p className='text-gray-600'>{item.description}</p>
							</div>
						))}
					</div>

					<div className='mt-12 text-center'>
						<Link
							href='/auth/signup'
							className='inline-flex items-center bg-purple-600 text-white font-bold rounded-lg px-6 py-2.5 text-sm sm:text-base hover:bg-purple-700 shadow-lg transform hover:scale-105 transition-all duration-300'>
							Start Your Journey Now <BsArrowRight className='ml-2 text-lg' />
						</Link>
					</div>
				</div>
			</section>

			{/* Testimonials */}
			<section className='w-full py-12 md:py-16 lg:py-20 bg-white '>
				<div className='max-w-7xl mx-auto px-2 sm:px-4 md:px-6 w-full overflow-x-hidden'>
					<div className='text-center mb-12 md:mb-16'>
						<h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900'>
							Voices of Our Valued Students
						</h2>
						<p className='mt-4 text-base sm:text-lg text-gray-700 max-w-2xl mx-auto'>
							Discover why students worldwide trust Top Nerd for academic
							excellence.
						</p>
					</div>
					<div className='w-full'>
						<TestimonialSlider />
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className='w-full py-12 md:py-16 lg:py-20 bg-gradient-to-r from-purple-600 to-indigo-700 text-white'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 text-center'>
					<h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 tracking-tight'>
						Ready to Elevate Your Grades?
					</h2>
					<p className='text-base sm:text-lg md:text-xl mb-8 max-w-3xl mx-auto opacity-90'>
						Join a community of successful students. Let Top Nerd handle the
						complexities while you focus on learning.
					</p>
					<div className='flex  sm:flex-row justify-center gap-4'>
						<Link
							href='/auth/signup'
							className='bg-white text-purple-700 hover:bg-purple-50 font-bold rounded-lg px-6 py-2.5 text-sm sm:text-base shadow-xl transform hover:scale-105 transition-all duration-300'>
							Submit Your Assignment
						</Link>
						<Link
							href='/services'
							className='bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold rounded-lg px-6 py-2.5 text-sm sm:text-base shadow-xl transform hover:scale-105 transition-all duration-300'>
							Explore Our Services
						</Link>
					</div>
				</div>
			</section>
		</main>
	);
}
