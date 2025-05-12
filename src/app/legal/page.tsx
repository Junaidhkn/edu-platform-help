import Link from 'next/link';
import {
	FaGavel,
	FaUserShield,
	FaGraduationCap,
	FaMoneyBillWave,
} from 'react-icons/fa';

export default function LegalPage() {
	return (
		<main className='flex flex-col items-center min-h-screen pt-20 pb-32'>
			<div className='max-w-5xl mx-auto px-4 sm:px-6 w-full'>
				{/* Header */}
				<section className='text-center mb-16'>
					<h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-6'>
						Legal Information
					</h1>
					<p className='text-xl text-gray-600 max-w-3xl mx-auto'>
						Important policies and guidelines for using Top Nerd services
					</p>
				</section>

				{/* Quick Navigation */}
				<section className='mb-16'>
					<div className='bg-gray-50 p-6 rounded-xl'>
						<h2 className='text-xl font-semibold mb-4'>Quick Navigation</h2>
						<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
							<Link
								href='#terms-of-service'
								className='flex items-center gap-2 text-purple-700 hover:text-purple-900 font-medium'>
								<FaGavel />
								Terms of Service
							</Link>
							<Link
								href='#privacy-policy'
								className='flex items-center gap-2 text-purple-700 hover:text-purple-900 font-medium'>
								<FaUserShield />
								Privacy Policy
							</Link>
							<Link
								href='#academic-integrity'
								className='flex items-center gap-2 text-purple-700 hover:text-purple-900 font-medium'>
								<FaGraduationCap />
								Academic Integrity
							</Link>
							<Link
								href='#refund-policy'
								className='flex items-center gap-2 text-purple-700 hover:text-purple-900 font-medium'>
								<FaMoneyBillWave />
								Refund Policy
							</Link>
						</div>
					</div>
				</section>

				{/* Terms of Service */}
				<section
					id='terms-of-service'
					className='mb-16 scroll-mt-20'>
					<div className='border-b pb-6 mb-6'>
						<div className='flex items-center gap-3 mb-4'>
							<FaGavel className='text-3xl text-purple-600' />
							<h2 className='text-3xl font-bold text-gray-900'>
								Terms of Service
							</h2>
						</div>
						<p className='text-gray-600 mb-4'>
							These Terms of Service govern your use of Top Nerd and the
							services we provide. By using our website and services, you agree
							to these terms.
						</p>
					</div>

					<div className='space-y-8'>
						<div>
							<h3 className='text-xl font-semibold mb-3'>
								1. Service Description
							</h3>
							<p className='text-gray-600 mb-3'>
								Top Nerd provides academic assistance and freelance services for
								students and professionals. Our services include assignment
								help, programming projects, research papers, and other academic
								work as detailed on our website.
							</p>
						</div>

						<div>
							<h3 className='text-xl font-semibold mb-3'>
								2. Account Registration
							</h3>
							<p className='text-gray-600 mb-3'>
								To use our services, you must create an account. You are
								responsible for maintaining the confidentiality of your account
								information and for all activities that occur under your
								account.
							</p>
						</div>

						<div>
							<h3 className='text-xl font-semibold mb-3'>
								3. Pricing and Payment
							</h3>
							<p className='text-gray-600 mb-3'>
								Our pricing is based on several factors including assignment
								type, academic level, subject area, and deadline. The pricing
								calculator uses the following factors to determine the final
								cost:
							</p>
							<ul className='list-disc pl-6 space-y-2 text-gray-600'>
								<li>
									<strong>Base Rate:</strong> We start with a standard per-word
									rate
								</li>
								<li>
									<strong>Subject Area:</strong> Prices vary by subject area
									(Arts, Business, Computer Science, Engineering/Mathematics)
								</li>
								<li>
									<strong>Assignment Type:</strong> Different types of
									assignments (coursework, book reports, research papers,
									thesis, proposals) have different pricing adjustments
								</li>
								<li>
									<strong>Academic Level:</strong> Undergraduate, Master&apos;s,
									and PhD level work are priced differently
								</li>
								<li>
									<strong>Deadline:</strong> Shorter deadlines result in higher
									prices
								</li>
							</ul>
							<p className='text-gray-600 mt-3'>
								<strong>Important:</strong> We will only begin working on your
								assignment after receiving complete payment. This ensures that
								our freelancers can commit fully to your project.
							</p>
						</div>

						<div>
							<h3 className='text-xl font-semibold mb-3'>
								4. Delivery and Deadlines
							</h3>
							<p className='text-gray-600 mb-3'>
								We commit to delivering all work by the agreed-upon deadline. If
								we anticipate any delays, we will communicate this promptly and
								work to find a solution.
							</p>
						</div>

						<div>
							<h3 className='text-xl font-semibold mb-3'>5. Revisions</h3>
							<p className='text-gray-600 mb-3'>
								We offer revisions to ensure your satisfaction with the
								delivered work. Revision requests should be consistent with the
								original instructions. Significant changes to the original
								requirements may incur additional charges.
							</p>
						</div>

						<div>
							<h3 className='text-xl font-semibold mb-3'>6. Termination</h3>
							<p className='text-gray-600 mb-3'>
								We reserve the right to terminate or suspend accounts for
								violations of these terms, including but not limited to:
								providing false information, using the service for illegal
								purposes, or engaging in abusive behavior toward our staff.
							</p>
						</div>
					</div>
				</section>

				{/* Privacy Policy */}
				<section
					id='privacy-policy'
					className='mb-16 scroll-mt-20'>
					<div className='border-b pb-6 mb-6'>
						<div className='flex items-center gap-3 mb-4'>
							<FaUserShield className='text-3xl text-purple-600' />
							<h2 className='text-3xl font-bold text-gray-900'>
								Privacy Policy
							</h2>
						</div>
						<p className='text-gray-600 mb-4'>
							Your privacy is important to us. This policy explains how we
							collect, use, and protect your personal information.
						</p>
					</div>

					<div className='space-y-8'>
						<div>
							<h3 className='text-xl font-semibold mb-3'>
								1. Information We Collect
							</h3>
							<p className='text-gray-600 mb-3'>
								We collect only the information necessary to provide our
								services, which may include:
							</p>
							<ul className='list-disc pl-6 space-y-2 text-gray-600'>
								<li>Contact information (name, email, phone number)</li>
								<li>
									Payment information (processed securely through third-party
									providers)
								</li>
								<li>Assignment details and requirements</li>
								<li>Communications with our team</li>
							</ul>
							<p className='text-gray-600 mt-3'>
								<strong>Note:</strong> We do not collect or require information
								about your educational institution, student ID, or other
								specific institutional details.
							</p>
						</div>

						<div>
							<h3 className='text-xl font-semibold mb-3'>
								2. How We Use Your Information
							</h3>
							<p className='text-gray-600 mb-3'>We use your information to:</p>
							<ul className='list-disc pl-6 space-y-2 text-gray-600'>
								<li>Provide and improve our services</li>
								<li>Process payments</li>
								<li>Communicate with you about your orders</li>
								<li>
									Send service updates or promotional content (you can opt out)
								</li>
							</ul>
						</div>

						<div>
							<h3 className='text-xl font-semibold mb-3'>3. Data Security</h3>
							<p className='text-gray-600 mb-3'>
								We implement appropriate security measures to protect your
								personal information from unauthorized access, alteration,
								disclosure, or destruction. Your payment information is never
								stored on our servers.
							</p>
						</div>

						<div>
							<h3 className='text-xl font-semibold mb-3'>
								4. Cookies and Tracking
							</h3>
							<p className='text-gray-600 mb-3'>
								We use cookies to enhance your experience on our website,
								analyze site usage, and assist in our marketing efforts. You can
								control cookies through your browser settings.
							</p>
						</div>

						<div>
							<h3 className='text-xl font-semibold mb-3'>
								5. Third-Party Disclosure
							</h3>
							<p className='text-gray-600 mb-3'>
								We do not sell or rent your personal information to third
								parties. We may share information with trusted service providers
								who assist us in operating our website and conducting our
								business, but only as necessary to provide our services.
							</p>
						</div>
					</div>
				</section>

				{/* Academic Integrity */}
				<section
					id='academic-integrity'
					className='mb-16 scroll-mt-20'>
					<div className='border-b pb-6 mb-6'>
						<div className='flex items-center gap-3 mb-4'>
							<FaGraduationCap className='text-3xl text-purple-600' />
							<h2 className='text-3xl font-bold text-gray-900'>
								Academic Integrity
							</h2>
						</div>
						<p className='text-gray-600 mb-4'>
							We believe in fostering academic excellence while maintaining the
							highest standards of integrity.
						</p>
					</div>

					<div className='space-y-8'>
						<div>
							<h3 className='text-xl font-semibold mb-3'>
								1. Purpose of Our Services
							</h3>
							<p className='text-gray-600 mb-3'>
								Our services are designed to:
							</p>
							<ul className='list-disc pl-6 space-y-2 text-gray-600'>
								<li>Provide reference materials and examples</li>
								<li>Help develop understanding of complex subjects</li>
								<li>Demonstrate proper research and citation techniques</li>
								<li>Assist with approaching challenging assignments</li>
							</ul>
						</div>

						<div>
							<h3 className='text-xl font-semibold mb-3'>
								2. Client Responsibilities
							</h3>
							<p className='text-gray-600 mb-3'>We expect our clients to:</p>
							<ul className='list-disc pl-6 space-y-2 text-gray-600'>
								<li>
									Use our work as a reference tool, not for direct submission
								</li>
								<li>
									Properly cite any material used from our services when
									appropriate
								</li>
								<li>
									Understand and adhere to their institution&apos;s academic
									integrity policies
								</li>
								<li>
									Use our services to enhance their learning, not replace it
								</li>
							</ul>
						</div>

						<div>
							<h3 className='text-xl font-semibold mb-3'>3. Our Commitment</h3>
							<p className='text-gray-600 mb-3'>We are committed to:</p>
							<ul className='list-disc pl-6 space-y-2 text-gray-600'>
								<li>Providing original, plagiarism-free work</li>
								<li>
									Creating high-quality content that demonstrates proper
									academic techniques
								</li>
								<li>Supporting the educational growth of our clients</li>
								<li>
									Never encouraging misrepresentation of work or academic
									dishonesty
								</li>
							</ul>
						</div>

						<div>
							<h3 className='text-xl font-semibold mb-3'>
								4. Educational Use Disclaimer
							</h3>
							<p className='text-gray-600 mb-3'>
								All work provided by Top Nerd is for research, reference, and
								educational purposes only. We do not condone or support academic
								dishonesty, including plagiarism or submitting our work as your
								own.
							</p>
						</div>
					</div>
				</section>

				{/* Refund Policy */}
				<section
					id='refund-policy'
					className='mb-16 scroll-mt-20'>
					<div className='border-b pb-6 mb-6'>
						<div className='flex items-center gap-3 mb-4'>
							<FaMoneyBillWave className='text-3xl text-purple-600' />
							<h2 className='text-3xl font-bold text-gray-900'>
								Refund Policy
							</h2>
						</div>
						<p className='text-gray-600 mb-4'>
							We strive for customer satisfaction and offer fair refund options
							when our services don&apos;t meet expectations.
						</p>
					</div>

					<div className='space-y-8'>
						<div>
							<h3 className='text-xl font-semibold mb-3'>
								1. Eligible Refund Scenarios
							</h3>
							<p className='text-gray-600 mb-3'>
								You may be eligible for a refund in the following circumstances:
							</p>
							<ul className='list-disc pl-6 space-y-2 text-gray-600'>
								<li>
									<strong>Missed Deadlines:</strong> If we fail to deliver your
									work by the agreed-upon deadline without prior communication
								</li>
								<li>
									<strong>Quality Issues:</strong> If the delivered work
									substantially fails to meet the requirements specified in your
									order
								</li>
								<li>
									<strong>Duplicate Payment:</strong> If you are charged
									multiple times for the same order
								</li>
								<li>
									<strong>Cancellation:</strong> If you cancel your order before
									we begin work
								</li>
							</ul>
						</div>

						<div>
							<h3 className='text-xl font-semibold mb-3'>2. Retake Support</h3>
							<p className='text-gray-600 mb-3'>
								In addition to refunds, we offer retake support for assignments
								that don&apos;t meet requirements. This includes:
							</p>
							<ul className='list-disc pl-6 space-y-2 text-gray-600'>
								<li>Free revisions to fix issues with the original work</li>
								<li>
									Additional support if the assignment received a failing grade
									despite following all instructions
								</li>
								<li>Consultation with a different expert if necessary</li>
							</ul>
						</div>

						<div>
							<h3 className='text-xl font-semibold mb-3'>3. Refund Process</h3>
							<p className='text-gray-600 mb-3'>To request a refund:</p>
							<ol className='list-decimal pl-6 space-y-2 text-gray-600'>
								<li>
									Contact our customer support team within 7 days of receiving
									your order
								</li>
								<li>Clearly explain the reason for your refund request</li>
								<li>
									Provide relevant documentation or evidence if applicable
								</li>
								<li>Our team will review your request within 48 hours</li>
							</ol>
							<p className='text-gray-600 mt-3'>
								If approved, refunds will be processed back to the original
								payment method within 5-10 business days.
							</p>
						</div>

						<div>
							<h3 className='text-xl font-semibold mb-3'>
								4. Non-Refundable Scenarios
							</h3>
							<p className='text-gray-600 mb-3'>
								Refunds may not be approved in these situations:
							</p>
							<ul className='list-disc pl-6 space-y-2 text-gray-600'>
								<li>Requests made more than 7 days after delivery</li>
								<li>Changed requirements after work has begun</li>
								<li>
									Claims not supported by the original order specifications
								</li>
								<li>
									Dissatisfaction with a grade when the work met all
									specifications
								</li>
							</ul>
						</div>

						<div>
							<h3 className='text-xl font-semibold mb-3'>5. Partial Refunds</h3>
							<p className='text-gray-600 mb-3'>
								In some cases, we may offer partial refunds when:
							</p>
							<ul className='list-disc pl-6 space-y-2 text-gray-600'>
								<li>Only a portion of the work fails to meet requirements</li>
								<li>Minor deadline delays occurred</li>
								<li>Revisions can reasonably address most concerns</li>
							</ul>
						</div>
					</div>
				</section>

				{/* Final CTA */}
				<section className='bg-gray-50 p-8 rounded-xl text-center'>
					<h2 className='text-2xl font-bold mb-4'>Have Questions?</h2>
					<p className='text-gray-600 mb-6'>
						Our support team is available to help clarify any questions you may
						have about our policies.
					</p>
					<Link
						href='/#how-it-works'
						className='bg-purple-600 text-white hover:bg-purple-700 font-semibold rounded-lg px-6 py-3 inline-block'>
						Learn How Top Nerd Works
					</Link>
				</section>
			</div>
		</main>
	);
}
