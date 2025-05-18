'use client';

import { Button } from '@/src/components/ui/button';
import { Textarea } from '@/src/components/ui/textarea';
import { UploadButton } from '@/src/lib/uploadThing';
import { useState } from 'react';
import { toast } from 'sonner';

interface SubmissionFormProps {
	orderId: string;
	onSubmit: (fileUrl: string, comments: string) => Promise<void>;
	isSubmitting: boolean;
}

export default function SubmissionForm({
	orderId,
	onSubmit,
	isSubmitting,
}: SubmissionFormProps) {
	const [comments, setComments] = useState('');
	const [fileUrl, setFileUrl] = useState('');
	const [fileName, setFileName] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!fileUrl) {
			toast.error('Please upload a file before submitting');
			return;
		}

		try {
			await onSubmit(fileUrl, comments);
			setComments('');
			setFileUrl('');
			setFileName('');
			toast.success('Work submitted successfully');
		} catch (error) {
			console.error('Error submitting work:', error);
			toast.error('Failed to submit work. Please try again.');
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className='space-y-4'>
			<div className='space-y-2'>
				<label className='block text-sm font-medium'>
					Upload Completed Work
				</label>
				<div className='border rounded-md p-4 bg-muted/50'>
					{!fileUrl ? (
						<UploadButton
							endpoint='blobUploader'
							onClientUploadComplete={(res) => {
								if (res && res.length > 0) {
									setFileUrl(res[0].url);
									setFileName(res[0].name);
									toast.success('File uploaded successfully');
								}
							}}
							onUploadError={(error: Error) => {
								toast.error(`Error uploading file: ${error.message}`);
							}}
						/>
					) : (
						<div className='flex flex-col space-y-2'>
							<div className='flex items-center justify-between'>
								<span className='text-sm font-medium truncate max-w-xs'>
									{fileName}
								</span>
								<Button
									type='button'
									variant='outline'
									size='sm'
									onClick={() => {
										setFileUrl('');
										setFileName('');
									}}>
									Remove
								</Button>
							</div>
							<a
								href={fileUrl}
								target='_blank'
								rel='noopener noreferrer'
								className='text-xs text-blue-600 hover:text-blue-800 underline'>
								Preview uploaded file
							</a>
						</div>
					)}
				</div>
			</div>

			<div className='space-y-2'>
				<label
					htmlFor='comments'
					className='block text-sm font-medium'>
					Additional Comments (optional)
				</label>
				<Textarea
					id='comments'
					placeholder='Add any notes about your submission here...'
					value={comments}
					onChange={(e) => setComments(e.target.value)}
					rows={4}
				/>
			</div>

			<Button
				type='submit'
				className='w-full'
				disabled={!fileUrl || isSubmitting}>
				{isSubmitting ? 'Submitting...' : 'Submit Work'}
			</Button>
		</form>
	);
}
