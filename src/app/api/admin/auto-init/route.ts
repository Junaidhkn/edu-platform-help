import { NextResponse } from 'next/server';
import { initializeAdminUser } from '@/src/lib/admin/init-admin';

// Tracking initialization status
let initialized = false;
let initializationPromise: Promise<boolean> | null = null;

// Create a singleton initialization function
async function ensureInitialization() {
	if (initialized) return true;

	if (!initializationPromise) {
		// Only create the promise once to avoid multiple concurrent initializations
		initializationPromise = initializeAdminUser()
			.then((result) => {
				initialized = result;
				console.log(`Admin initialization ${result ? 'succeeded' : 'failed'}`);
				return result;
			})
			.catch((error) => {
				console.error('Admin initialization error:', error);
				return false;
			});
	}

	return initializationPromise;
}

// Start initialization when this module is loaded
ensureInitialization();

export async function GET() {
	const success = await ensureInitialization();

	return NextResponse.json({
		success,
		message: success
			? 'Admin initialization completed successfully'
			: 'Admin initialization failed',
	});
}
