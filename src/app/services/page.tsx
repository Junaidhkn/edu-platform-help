import Link from 'next/link';
import {
	FaGraduationCap,
	FaLaptopCode,
	FaBook,
	FaClipboardList,
	FaFileAlt,
	FaFileContract,
} from 'react-icons/fa';

export default function ServicesPage() {
	return (
		<main className='flex flex-col items-center min-h-screen pt-20 pb-32'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 w-full'>
				{/* Header */}
				<section className='text-center mb-16'>
					<h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-6'>
						Our Academic Services
					</h1>
					<p className='text-xl text-gray-600 max-w-3xl mx-auto'>
						We offer expert assistance for various academic needs across
						different subjects and academic levels.
					</p>
				</section>

				{/* Assignment Types */}
				<section className='mb-20'>
					<h2 className='text-3xl font-bold text-gray-900 mb-10 text-center'>
						Assignment Types
					</h2>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
						<div className='bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-purple-100'>
							<div className='w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-5'>
								<FaClipboardList className='text-purple-600 text-2xl' />
							</div>
							<h3 className='text-2xl font-semibold mb-3'>Coursework</h3>
							<p className='text-gray-600 mb-4'>
								General academic assignments including essays, problem sets, and
								regular homework assignments.
							</p>
							<Link
								href='/auth/signup'
								className='inline-flex items-center text-purple-600 font-medium'>
								Get started
							</Link>
						</div>

						<div className='bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-purple-100'>
							<div className='w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-5'>
								<FaBook className='text-indigo-600 text-2xl' />
							</div>
							<h3 className='text-2xl font-semibold mb-3'>Book Reports</h3>
							<p className='text-gray-600 mb-4'>
								Detailed analyses of books, including summaries, character
								studies, and thematic explorations.
							</p>
							<Link
								href='/auth/signup'
								className='inline-flex items-center text-indigo-600 font-medium'>
								Get started
							</Link>
						</div>

						<div className='bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-purple-100'>
							<div className='w-14 h-14 bg-pink-100 rounded-full flex items-center justify-center mb-5'>
								<FaFileAlt className='text-pink-600 text-2xl' />
							</div>
							<h3 className='text-2xl font-semibold mb-3'>Research Papers</h3>
							<p className='text-gray-600 mb-4'>
								In-depth academic papers requiring research, citations, and
								original analysis on specific topics.
							</p>
							<Link
								href='/auth/signup'
								className='inline-flex items-center text-pink-600 font-medium'>
								Get started
							</Link>
						</div>

						<div className='bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-purple-100'>
							<div className='w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-5'>
								<FaGraduationCap className='text-purple-600 text-2xl' />
							</div>
							<h3 className='text-2xl font-semibold mb-3'>Thesis Writing</h3>
							<p className='text-gray-600 mb-4'>
								Comprehensive thesis papers for undergraduate, master&apos;s,
								and PhD levels with rigorous research.
							</p>
							<Link
								href='/auth/signup'
								className='inline-flex items-center text-purple-600 font-medium'>
								Get started
							</Link>
						</div>

						<div className='bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-purple-100'>
							<div className='w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-5'>
								<FaFileContract className='text-indigo-600 text-2xl' />
							</div>
							<h3 className='text-2xl font-semibold mb-3'>Proposals</h3>
							<p className='text-gray-600 mb-4'>
								Research proposals, project proposals, and business proposals
								with clear methodology and objectives.
							</p>
							<Link
								href='/auth/signup'
								className='inline-flex items-center text-indigo-600 font-medium'>
								Get started
							</Link>
						</div>

						<div className='bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-purple-100'>
							<div className='w-14 h-14 bg-pink-100 rounded-full flex items-center justify-center mb-5'>
								<FaLaptopCode className='text-pink-600 text-2xl' />
							</div>
							<h3 className='text-2xl font-semibold mb-3'>
								Programming Projects
							</h3>
							<p className='text-gray-600 mb-4'>
								Coding assignments, software development, and technical projects
								across various programming languages.
							</p>
							<Link
								href='/auth/signup'
								className='inline-flex items-center text-pink-600 font-medium'>
								Get started
							</Link>
						</div>
					</div>
				</section>

				{/* Subject Areas */}
				<section className='mb-20'>
					<h2 className='text-3xl font-bold text-gray-900 mb-10 text-center'>
						Subject Areas
					</h2>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
						<div className='bg-gradient-to-br from-purple-50 to-indigo-50 p-8 rounded-xl shadow-sm'>
							<h3 className='text-2xl font-semibold mb-5 text-purple-800'>
								Arts & Humanities
							</h3>
							<ul className='grid grid-cols-2 gap-4'>
								<li className='flex items-center gap-2'>
									<div className='w-2 h-2 bg-purple-500 rounded-full'></div>
									<span>Literature</span>
								</li>
								<li className='flex items-center gap-2'>
									<div className='w-2 h-2 bg-purple-500 rounded-full'></div>
									<span>History</span>
								</li>
								<li className='flex items-center gap-2'>
									<div className='w-2 h-2 bg-purple-500 rounded-full'></div>
									<span>Philosophy</span>
								</li>
								<li className='flex items-center gap-2'>
									<div className='w-2 h-2 bg-purple-500 rounded-full'></div>
									<span>Languages</span>
								</li>
								<li className='flex items-center gap-2'>
									<div className='w-2 h-2 bg-purple-500 rounded-full'></div>
									<span>Art & Design</span>
								</li>
								<li className='flex items-center gap-2'>
									<div className='w-2 h-2 bg-purple-500 rounded-full'></div>
									<span>Cultural Studies</span>
								</li>
							</ul>
						</div>

						<div className='bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-xl shadow-sm'>
							<h3 className='text-2xl font-semibold mb-5 text-blue-800'>
								Business
							</h3>
							<ul className='grid grid-cols-2 gap-4'>
								<li className='flex items-center gap-2'>
									<div className='w-2 h-2 bg-blue-500 rounded-full'></div>
									<span>Management</span>
								</li>
								<li className='flex items-center gap-2'>
									<div className='w-2 h-2 bg-blue-500 rounded-full'></div>
									<span>Marketing</span>
								</li>
								<li className='flex items-center gap-2'>
									<div className='w-2 h-2 bg-blue-500 rounded-full'></div>
									<span>Finance</span>
								</li>
								<li className='flex items-center gap-2'>
									<div className='w-2 h-2 bg-blue-500 rounded-full'></div>
									<span>Accounting</span>
								</li>
								<li className='flex items-center gap-2'>
									<div className='w-2 h-2 bg-blue-500 rounded-full'></div>
									<span>Economics</span>
								</li>
								<li className='flex items-center gap-2'>
									<div className='w-2 h-2 bg-blue-500 rounded-full'></div>
									<span>Strategic Planning</span>
								</li>
							</ul>
						</div>

						<div className='bg-gradient-to-br from-green-50 to-teal-50 p-8 rounded-xl shadow-sm'>
							<h3 className='text-2xl font-semibold mb-5 text-green-800'>
								Computer Science
							</h3>
							<ul className='grid grid-cols-2 gap-4'>
								<li className='flex items-center gap-2'>
									<div className='w-2 h-2 bg-green-500 rounded-full'></div>
									<span>Programming</span>
								</li>
								<li className='flex items-center gap-2'>
									<div className='w-2 h-2 bg-green-500 rounded-full'></div>
									<span>Web Development</span>
								</li>
								<li className='flex items-center gap-2'>
									<div className='w-2 h-2 bg-green-500 rounded-full'></div>
									<span>Algorithms</span>
								</li>
								<li className='flex items-center gap-2'>
									<div className='w-2 h-2 bg-green-500 rounded-full'></div>
									<span>Data Structures</span>
								</li>
								<li className='flex items-center gap-2'>
									<div className='w-2 h-2 bg-green-500 rounded-full'></div>
									<span>Database Systems</span>
								</li>
								<li className='flex items-center gap-2'>
									<div className='w-2 h-2 bg-green-500 rounded-full'></div>
									<span>Machine Learning</span>
								</li>
							</ul>
						</div>

						<div className='bg-gradient-to-br from-red-50 to-pink-50 p-8 rounded-xl shadow-sm'>
							<h3 className='text-2xl font-semibold mb-5 text-red-800'>
								Engineering & Mathematics
							</h3>
							<ul className='grid grid-cols-2 gap-4'>
								<li className='flex items-center gap-2'>
									<div className='w-2 h-2 bg-red-500 rounded-full'></div>
									<span>Mechanical Engineering</span>
								</li>
								<li className='flex items-center gap-2'>
									<div className='w-2 h-2 bg-red-500 rounded-full'></div>
									<span>Electrical Engineering</span>
								</li>
								<li className='flex items-center gap-2'>
									<div className='w-2 h-2 bg-red-500 rounded-full'></div>
									<span>Civil Engineering</span>
								</li>
								<li className='flex items-center gap-2'>
									<div className='w-2 h-2 bg-red-500 rounded-full'></div>
									<span>Calculus</span>
								</li>
								<li className='flex items-center gap-2'>
									<div className='w-2 h-2 bg-red-500 rounded-full'></div>
									<span>Statistics</span>
								</li>
								<li className='flex items-center gap-2'>
									<div className='w-2 h-2 bg-red-500 rounded-full'></div>
									<span>Physics</span>
								</li>
							</ul>
						</div>
					</div>
				</section>

				{/* Academic Levels */}
				<section className='mb-20'>
					<h2 className='text-3xl font-bold text-gray-900 mb-10 text-center'>
						Academic Levels
					</h2>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
						<div className='bg-white p-8 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow border border-purple-100'>
							<div className='w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6'>
								<FaGraduationCap className='text-purple-600 text-3xl' />
							</div>
							<h3 className='text-2xl font-semibold mb-3'>Undergraduate</h3>
							<p className='text-gray-600'>
								Assignments for college and university students working toward
								their bachelor&apos;s degrees.
							</p>
						</div>

						<div className='bg-white p-8 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow border border-purple-100'>
							<div className='w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6'>
								<FaGraduationCap className='text-indigo-600 text-3xl' />
							</div>
							<h3 className='text-2xl font-semibold mb-3'>
								Master&apos;s Level
							</h3>
							<p className='text-gray-600'>
								Advanced academic work for students pursuing master&apos;s
								degrees requiring higher analytical skills.
							</p>
						</div>

						<div className='bg-white p-8 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow border border-purple-100'>
							<div className='w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6'>
								<FaGraduationCap className='text-pink-600 text-3xl' />
							</div>
							<h3 className='text-2xl font-semibold mb-3'>PhD Level</h3>
							<p className='text-gray-600'>
								Doctoral-level work including dissertation chapters, literature
								reviews, and original research.
							</p>
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className='bg-purple-700 text-white p-10 md:p-16 rounded-2xl'>
					<div className='text-center'>
						<h2 className='text-3xl md:text-4xl font-bold mb-6'>
							Ready to Get Started?
						</h2>
						<p className='text-xl mb-8 max-w-3xl mx-auto'>
							Sign up today and connect with our expert freelancers to help you
							succeed in your academic journey.
						</p>
						<Link
							href='/auth/signup'
							className='bg-white text-purple-700 hover:bg-gray-100 font-semibold rounded-lg px-8 py-4 text-lg inline-block'>
							Sign Up Now
						</Link>
					</div>
				</section>
			</div>
		</main>
	);
}
