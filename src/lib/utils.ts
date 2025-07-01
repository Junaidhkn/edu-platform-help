import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Format a number as a currency string with the given currency symbol and locale
 */
export function formatCurrency(
	amount: number,
	currency = 'USD',
	locale = 'en-US',
): string {
	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency,
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(amount);
}

export function formatBytes(bytes: number, decimals = 2) {
	if (bytes === 0) return '0 Bytes';

	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export interface EmailPayload {
	to: string;
	subject: string;
	html: string;
}

/**
 * A utility function to send an email by calling our backend API endpoint.
 *
 * @param payload - An object containing the 'to', 'subject', and 'html' for the email.
 * @returns The JSON response from the API.
 * @throws An error if the fetch request or the API response fails.
 */
export async function sendEmail(payload: EmailPayload): Promise<any> {
	const apiEndpoint = '/api/send';

	try {
		const response = await fetch(apiEndpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		});
		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error?.message || 'API request failed');
		}
		return await response.json();
	} catch (error) {
		console.error('Error in sendEmail utility:', error);
		throw error;
	}
}
