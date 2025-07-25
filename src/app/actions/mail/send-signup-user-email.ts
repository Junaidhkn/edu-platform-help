'use server';

import { VERIFICATION_TOKEN_EXP_MIN } from '@/src/lib/constants';
import { sendEmail } from '@/src/lib/utils';

export async function sendSignupUserEmail({
	email,
	token,
}: {
	email: string;
	token: string;
}) {
	console.log(`Sending email to ${email} with token ${token}`);

	await sendEmail({
		to: email,
		subject: 'Verify your email address',
		html: `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
      <h2 style="text-align: center; color: #3b82f6;">Top Nerd</h2>

      <p>Hi there,</p>

      <p>Please use the link below to verify your email address and continue on Edu-assign-help. This link will expire in ${VERIFICATION_TOKEN_EXP_MIN} minutes. If you don't think you should be receiving this email, you can safely ignore it.</p>

      <p style="text-align: center;">
        <a href="${process.env.AUTH_URL}/auth/signup/verify-email?token=${token}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #3b82f6; text-decoration: none; border-radius: 5px;">Verify Email</a>
      </p>
      
      <br />

      <p>You received this email because you signed up for Top Nerd.</p>

      <p style="text-align: center; font-size: 12px; color: #aaa;">&copy; 2025 Top Nerd. All rights reserved.</p>
    </div>
    `,
	});

	console.log(`Email sent to ${email} with token ${token}`);
}
