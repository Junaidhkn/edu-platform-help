import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import db from '@/src/db';
import { submissions } from '@/src/db/schema';
import { orders } from '@/src/db/schema';
import { freelancers } from '@/src/db/schema';
import { users } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import { USER_ROLES } from '@/src/lib/constants';
import { sendEmail } from '@/src/lib/utils';

export async function PATCH(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		// 1. Check admin authentication
		const session = await auth();

		if (!session?.user || session.user.role !== USER_ROLES.ADMIN) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const submissionId = params.id;
		if (!submissionId) {
			return NextResponse.json(
				{ error: 'Submission ID is required' },
				{ status: 400 },
			);
		}

		// 2. Get submission data
		const data = await request.json();
		const { status, adminFeedback } = data;

		if (!status || !['approved', 'rejected'].includes(status)) {
			return NextResponse.json(
				{ error: 'Valid status (approved/rejected) is required' },
				{ status: 400 },
			);
		}

		// 3. Get the current submission
		const existingSubmission = await db.query.submissions.findFirst({
			where: eq(submissions.id, submissionId),
		});

		if (!existingSubmission) {
			return NextResponse.json(
				{ error: 'Submission not found' },
				{ status: 404 },
			);
		}

		// 4. Update submission status and feedback
		await db
			.update(submissions)
			.set({
				status,
				adminFeedback: adminFeedback || null,
				updatedAt: new Date().toISOString(),
				reviewedBy: session.user.id,
			})
			.where(eq(submissions.id, submissionId));

		// 5. Get order and freelancer information
		const orderData = await db.query.orders.findFirst({
			where: eq(orders.id, existingSubmission.orderId),
		});

		const freelancerData = await db.query.freelancers.findFirst({
			where: eq(freelancers.id, existingSubmission.freelancerId),
		});

		// 6. If approved, update order status to completed and transfer file URLs
		if (status === 'approved' && orderData) {
			// Parse fileUrls from submission
			let fileUrls;
			try {
				fileUrls = JSON.parse(existingSubmission.fileUrls);
			} catch (error) {
				fileUrls = existingSubmission.fileUrls;
			}

			// Transform to appropriate format and transfer to order completedFileUrls
			const completedFileUrls = Array.isArray(fileUrls)
				? fileUrls.join(',')
				: fileUrls;

			await db
				.update(orders)
				.set({
					orderStatus: 'completed',
					completedFileUrls: completedFileUrls,
					updatedAt: new Date().toISOString(),
				})
				.where(eq(orders.id, existingSubmission.orderId));

			// 7. Mark submission as delivered
			await db
				.update(submissions)
				.set({
					isDelivered: true,
					deliveredAt: new Date().toISOString(),
				})
				.where(eq(submissions.id, submissionId));

			// 8. Send email notification to the user
			if (orderData.userId) {
				try {
					const userData = await db.query.users.findFirst({
						where: eq(users.id, orderData.userId),
					});

					if (userData?.email) {
						// Include file links in the email for direct access
						const fileLinksHtml = Array.isArray(fileUrls)
							? fileUrls
									.map(
										(url, index) =>
											`<p><a href="${url}" target="_blank">Download File ${
												index + 1
											}</a></p>`,
									)
									.join('')
							: '';

						await sendEmail({
							to: userData.email,
							subject: `Good news!Your Order #${orderData.id.slice(
								-6,
							)} is Complete!You can download your files now.`,
							html: `
                <h2>Good news! Your order is complete</h2>
                <p>Your order #${orderData.id.slice(
									-6,
								)} has been completed and is ready for download.</p>
                <p>You can access your order details and download the files <a href="${
									process.env.NEXTAUTH_URL
								}/profile/orders/${orderData.id}">here</a>.</p>
                ${
									fileLinksHtml
										? `<h3>Download Files:</h3>${fileLinksHtml}`
										: ''
								}
                <p>Thank you for using our service!</p>
              `,
						});
					}
				} catch (emailError) {
					console.error('Error sending user notification email:', emailError);
					// Continue execution even if email fails
				}
			}
		}

		// 9. Send notification to freelancer about submission status
		if (freelancerData?.email) {
			try {
				const emailSubject =
					status === 'approved'
						? 'Your submission has been approved!'
						: 'Your submission requires changes';

				const emailText =
					status === 'approved'
						? `Congratulations! Your submission for order #${existingSubmission.orderId.slice(
								-6,
						  )} has been approved.`
						: `Your submission for order #${existingSubmission.orderId.slice(
								-6,
						  )} needs changes. Admin feedback: ${
								adminFeedback || 'No specific feedback provided.'
						  }`;

				await sendEmail({
					to: freelancerData.email,
					subject: emailSubject,
					html: `
            <h2>${
							status === 'approved'
								? 'Submission Approved'
								: 'Submission Needs Changes'
						}</h2>
            <p>${emailText}</p>
            <p>Order: #${existingSubmission.orderId.slice(-6)}</p>
            ${
							status === 'rejected'
								? `<p><strong>Feedback:</strong> ${
										adminFeedback || 'No specific feedback provided.'
								  }</p>`
								: ''
						}
            <p>You can view the submission details <a href="${
							process.env.NEXTAUTH_URL
						}/freelancer/orders/${existingSubmission.orderId}">here</a>.</p>
          `,
				});
			} catch (emailError) {
				console.error(
					'Error sending freelancer notification email:',
					emailError,
				);
				// Continue execution even if email fails
			}
		}

		return NextResponse.json({
			success: true,
			message: `Submission ${status}`,
		});
	} catch (error) {
		console.error('Error updating submission:', error);
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 },
		);
	}
}
