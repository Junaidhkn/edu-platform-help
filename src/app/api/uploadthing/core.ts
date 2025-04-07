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
			console.log('Upload complete:', file.ufsUrl);
			return { url: file.ufsUrl };
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
			console.log('Upload complete:', file.ufsUrl);
			return { url: file.ufsUrl };
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
			console.log('Upload complete:', file.ufsUrl);
			return { url: file.ufsUrl };
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
			console.log('Upload complete:', file.ufsUrl);
			return { url: file.ufsUrl };
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
			console.log('Upload complete:', file.ufsUrl);
			return { url: file.ufsUrl };
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
