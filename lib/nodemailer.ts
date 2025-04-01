import 'server-only';

import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
	host: 'smtp.mandrillapp.com',
	port: 587,
	secure: false,
	auth: {
		user: process.env.SMTP_Username,
		pass: process.env.SMTP_Password,
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
