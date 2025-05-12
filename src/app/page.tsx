'use client';
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
import TestimonialSlider from '@/components/TestimonialSlider';

export default function Home() {
	return (
		<main className='flex flex-col items-center min-h-screen bg-slate-50'>
			{/* Hero Section */}
			<section className='w-full bg-gradient-to-br from-slate-900 via-purple-900 to-violet-800 text-white'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-32 flex flex-col md:flex-row items-center justify-between'>
					<div className='md:w-1/2 mb-12 md:mb-0 space-y-8 text-center md:text-left'>
						<h1 className='text-5xl md:text-6xl font-extrabold tracking-tight leading-tight'>
							Unlock Your Academic Potential
						</h1>
						<p className='text-xl md:text-2xl opacity-80 max-w-xl mx-auto md:mx-0'>
							Premium academic solutions and expert freelance support, tailored
							for your success.
						</p>
						<div className='pt-6 flex flex-col sm:flex-row gap-4 justify-center md:justify-start'>
							<Link
								href='/auth/signup'
								className='bg-white text-purple-700 hover:bg-purple-100 font-bold rounded-lg px-8 py-4 text-lg shadow-lg transform hover:scale-105 transition-transform duration-300'>
								Get Started Today
							</Link>
							<Link
								href='#how-it-works'
								className='bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple-700 font-bold rounded-lg px-8 py-4 text-lg shadow-lg transform hover:scale-105 transition-transform duration-300'>
								Learn How It Works
							</Link>
						</div>
					</div>
					<div className='md:w-1/2 flex justify-center items-center'>
						<Image
							src={HomeImage}
							alt='Academic Success Hero Image'
							className='max-w-lg w-full rounded-lg shadow-2xl'
							width={500}
							height={500}
							priority
						/>
					</div>
				</div>
			</section>

			{/* Services Section */}
			<section className='w-full py-20 bg-white'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6'>
					<div className='text-center mb-20'>
						<h2 className='text-4xl md:text-5xl font-bold text-slate-900'>
							Our Premier Services
						</h2>
						<p className='mt-6 text-xl text-gray-700 max-w-2xl mx-auto'>
							From complex assignments to coding projects, we provide expert
							solutions.
						</p>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
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
								className='bg-slate-50 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2 flex flex-col items-center text-center'>
								<div
									className={`w-16 h-16 bg-${service.color}-100 rounded-full flex items-center justify-center mb-6 ring-4 ring-${service.color}-200`}>
									<service.icon
										className={`text-${service.color}-600 text-3xl`}
									/>
								</div>
								<h3 className='text-2xl font-semibold mb-4 text-slate-900'>
									{service.title}
								</h3>
								<p className='text-gray-600 mb-6 flex-grow'>
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
				className='w-full py-20 bg-slate-100'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6'>
					<div className='text-center mb-20'>
						<h2 className='text-4xl md:text-5xl font-bold text-slate-900'>
							Simple Steps to Success
						</h2>
						<p className='mt-6 text-xl text-gray-700 max-w-2xl mx-auto'>
							Getting started with Top Nerd is quick, easy, and transparent.
						</p>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10'>
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
								className='bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2 text-center flex flex-col items-center'>
								<div className='w-20 h-20 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold ring-4 ring-purple-200'>
									{item.step}
								</div>
								<h3 className='text-2xl font-semibold mb-3 text-slate-900'>
									{item.title}
								</h3>
								<p className='text-gray-600'>{item.description}</p>
							</div>
						))}
					</div>

					<div className='mt-16 text-center'>
						<Link
							href='/auth/signup'
							className='inline-flex items-center bg-purple-600 text-white font-bold rounded-lg px-10 py-4 text-lg hover:bg-purple-700 shadow-lg transform hover:scale-105 transition-transform duration-300'>
							Start Your Journey Now <BsArrowRight className='ml-3 text-xl' />
						</Link>
					</div>
				</div>
			</section>

			{/* Testimonials */}
			<section className='w-full py-20 bg-white'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6'>
					<div className='text-center mb-20'>
						<h2 className='text-4xl md:text-5xl font-bold text-slate-900'>
							Voices of Our Valued Students
						</h2>
						<p className='mt-6 text-xl text-gray-700 max-w-2xl mx-auto'>
							Discover why students worldwide trust Top Nerd for academic
							excellence.
						</p>
					</div>
					<TestimonialSlider />
				</div>
			</section>

			{/* CTA Section */}
			<section className='w-full py-24 bg-gradient-to-r from-purple-600 to-indigo-700 text-white'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 text-center'>
					<h2 className='text-4xl md:text-5xl font-extrabold mb-6 tracking-tight'>
						Ready to Elevate Your Grades?
					</h2>
					<p className='text-xl md:text-2xl mb-10 max-w-3xl mx-auto opacity-90'>
						Join a community of successful students. Let Top Nerd handle the
						complexities while you focus on learning.
					</p>
					<div className='flex flex-col sm:flex-row justify-center gap-6'>
						<Link
							href='/auth/signup'
							className='bg-white text-purple-700 hover:bg-purple-100 font-bold rounded-lg px-10 py-4 text-lg shadow-xl transform hover:scale-105 transition-transform duration-300'>
							Submit Your Assignment
						</Link>
						<Link
							href='/services'
							className='bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple-700 font-bold rounded-lg px-10 py-4 text-lg shadow-xl transform hover:scale-105 transition-transform duration-300'>
							Explore Our Services
						</Link>
					</div>
				</div>
			</section>
		</main>
	);
}
