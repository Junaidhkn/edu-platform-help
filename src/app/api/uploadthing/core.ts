import { auth } from '@/auth';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';

const f = createUploadthing({
	errorFormatter: (err) => {
		console.error('UploadThing Error:', err);
		return { message: err.message, cause: String(err.cause) };
	},
});

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
	// Define as many FileRoutes as you like, each with a unique routeSlug
	imageUploader: f({
		image: {
			maxFileSize: '128MB',
			maxFileCount: 1,
		},
	})
		// Set permissions and file types for this FileRoute
		.middleware(async ({ req }) => {
			const session = await auth();
			if (!session) {
				throw new UploadThingError('You need to be logged in to upload files');
			}
			return { userId: session?.user?.id };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			console.log('Upload complete:', file.url);
			return { url: file.url };
		}),
	profilePictureUploader: f({
		image: {
			maxFileSize: '16MB',
			maxFileCount: 1,
		},
	})
		.middleware(async ({ req }) => {
			const session = await auth();
			if (!session) {
				throw new UploadThingError('You need to be logged in to upload files');
			}
			return { userId: session?.user?.id };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			console.log('Upload complete:', file.url);
			return { url: file.url };
		}),
	pdfUploader: f({
		pdf: {
			maxFileSize: '256MB',
			maxFileCount: 1,
		},
	})
		.middleware(async ({ req }) => {
			const session = await auth();
			if (!session) {
				throw new UploadThingError('You need to be logged in to upload files');
			}
			return { userId: session?.user?.id };
		})
		.onUploadComplete(({ metadata, file }) => {
			console.log('Upload complete:', file.url);
			return { url: file.url };
		}),
	blobUploader: f({
		blob: {
			maxFileSize: '1024MB',
			maxFileCount: 1,
		},
	})
		.middleware(async ({ req }) => {
			const session = await auth();
			if (!session) {
				throw new UploadThingError('You need to be logged in to upload files');
			}
			return { userId: session?.user?.id };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			console.log('Upload complete:', file.url);
			return { url: file.url };
		}),
	textUploader: f({
		text: {
			maxFileSize: '64MB',
			maxFileCount: 8,
		},
	})
		.middleware(async ({ req }) => {
			const session = await auth();
			if (!session) {
				throw new UploadThingError('You need to be logged in to upload files');
			}
			return { userId: session?.user?.id };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			console.log('Upload complete:', file.url);
			return { url: file.url };
		}),
	
	// Uploader for freelancer submissions
	submissionUploader: f({
		// Accept multiple file types for flexibility
		image: { maxFileSize: "128MB", maxFileCount: 5 },
		pdf: { maxFileSize: "256MB", maxFileCount: 5 },
		text: { maxFileSize: "64MB", maxFileCount: 5 },
		audio: { maxFileSize: "128MB", maxFileCount: 5 },
		video: { maxFileSize: "1024MB", maxFileCount: 2 },
		blob: { maxFileSize: "1024MB", maxFileCount: 3 },
	})
		.middleware(async ({ req }) => {
			const session = await auth();
			if (!session || !session.user) {
				throw new UploadThingError('You need to be logged in to upload files');
			}
			
			// Authentication is handled by the submission API endpoint
			// We allow any logged in user to upload here, and the API endpoint
			// will verify they're a freelancer assigned to the order
			
			return { 
				userId: session.user.id
			};
		})
		.onUploadComplete(async ({ metadata, file }) => {
			console.log('Submission upload complete:', file.url);
			
			return { 
				url: file.url, 
				name: file.name
			};
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
