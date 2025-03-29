import 'server-only';

import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
	host: 'smtp-relay.brevo.com',
	port: 587,
	secure: false,
	auth: {
		user: process.env.BREVO_SMTP_USER,
		pass: process.env.BREVO_SMTP_PASSWORD,
	},
});

// Verify the connection configuration
transport.verify(function (error, success) {
	if (error) {
		console.log('SMTP server connection error: ', error);
	} else {
		console.log('SMTP server connection verified');
	}
});

export default transport;
