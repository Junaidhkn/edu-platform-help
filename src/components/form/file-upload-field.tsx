'use client';

import React, { useState } from 'react';
import { UploadDropzone } from '@/src/lib/uploadThing';
import { toast } from 'sonner';
import { FileIcon, Loader2, X } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Button } from '@/src/components/ui/button';

interface FileUploadFieldProps {
	onChange: (value: string[]) => void;
	value: string[];
	className?: string;
}

export function FileUploadField({
	onChange,
	value,
	className,
}: FileUploadFieldProps) {
	const [isUploading, setIsUploading] = useState(false);

	const onUploadComplete = (res: any) => {
		setIsUploading(false);
		const urls = res.map((file: any) => file.url);
		onChange([...value, ...urls]);
		toast.success(`${res.length} file${res.length === 1 ? '' : 's'} uploaded`);
	};

	return (
		<div className={cn('space-y-4', className)}>
			{/* Upload area */}
			<div className='flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-4'>
				{isUploading ? (
					<div className='flex flex-col items-center justify-center py-4'>
						<Loader2 className='h-8 w-8 animate-spin text-primary' />
						<p className='mt-2 text-sm text-muted-foreground'>Uploading...</p>
					</div>
				) : (
					<UploadDropzone
						endpoint='pdfUploader'
						onClientUploadComplete={onUploadComplete}
						onUploadError={(error: Error) => {
							setIsUploading(false);
							toast.error(`Upload failed: ${error.message}`);
							console.log(error);
						}}
						onUploadBegin={() => setIsUploading(true)}
						className='ut-button:bg-primary ut-button:ut-readying:bg-primary/80 ut-button:ut-uploading:bg-primary/80'
					/>
				)}
			</div>

			{/* File list */}
			{value.length > 0 && (
				<div className='space-y-2'>
					{value.map((file, index) => (
						<div
							key={index}
							className='flex items-center justify-between rounded-md border p-2'>
							<div className='flex items-center space-x-2 truncate max-w-[80%]'>
								<FileIcon className='h-4 w-4 text-primary' />
								<a
									href={file}
									target='_blank'
									rel='noreferrer'
									className='text-sm text-blue-600 hover:underline truncate'>
									{file.split('/').pop()}
								</a>
							</div>
							<Button
								type='button'
								variant='ghost'
								size='sm'
								onClick={() => {
									const newFiles = [...value];
									newFiles.splice(index, 1);
									onChange(newFiles);
								}}>
								<X className='h-4 w-4' />
							</Button>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
