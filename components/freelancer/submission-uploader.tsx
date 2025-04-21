'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { UploadDropzone } from '@/lib/uploadThing';
import { cn } from '@/lib/utils';

// Define the form schema
const formSchema = z.object({
  comment: z.string().optional(),
  fileUrls: z.array(z.string()).min(1, { message: 'Please upload at least one file' }),
});

type FormValues = z.infer<typeof formSchema>;

interface SubmissionUploaderProps {
  orderId: string;
  onSuccess?: () => void;
}

export default function SubmissionUploader({ orderId, onSuccess }: SubmissionUploaderProps) {
  const router = useRouter();
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: '',
      fileUrls: [],
    },
  });

  const fileUrls = form.watch('fileUrls');

  const handleSubmit = async (values: FormValues) => {
    if (values.fileUrls.length === 0) {
      toast.error('Please upload at least one file');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/freelancer/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          fileUrls: values.fileUrls,
          comment: values.comment || '',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit work');
      }

      toast.success('Your work has been submitted for review');
      
      if (onSuccess) {
        onSuccess();
      }
      
      // Refresh the page to show the new submission
      router.refresh();
      
      // Reset the form
      form.reset();
      setFileNames([]);
      
    } catch (error) {
      toast.error('Failed to submit work. Please try again.');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Submit Work</CardTitle>
        <CardDescription>
          Upload your completed work for this order
        </CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Upload Files</h3>
            <UploadDropzone
              endpoint='blobUploader'
              onClientUploadComplete={(res) => {
                if (res) {
                  const urls = res.map((file) => file.url);
                  const names = res.map((file) => file.name);
                  
                  form.setValue('fileUrls', urls, {
                    shouldValidate: true,
                  });
                  
                  setFileNames(names);
                  
                  toast.success(`Uploaded ${res.length} file(s) successfully`);
                }
              }}
              onUploadError={(error) => {
                toast.error(`Upload failed: ${error.message}`);
              }}
              className={cn(
                "border-dashed",
                fileUrls.length > 0 && "border-green-500 bg-green-50/50 dark:bg-green-900/20"
              )}
            />
            
            {fileNames.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium">Uploaded files:</p>
                <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                  {fileNames.map((name, index) => (
                    <li key={index} className="flex items-center">
                      <span className="truncate max-w-[250px]">{name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {form.formState.errors.fileUrls && (
              <p className="text-sm text-destructive mt-2">
                {form.formState.errors.fileUrls.message}
              </p>
            )}
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Comments (Optional)</h3>
            <Textarea
              placeholder="Add any comments or notes for the admin reviewer"
              {...form.register('comment')}
              rows={4}
            />
            {form.formState.errors.comment && (
              <p className="text-sm text-destructive mt-2">
                {form.formState.errors.comment.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting || fileUrls.length === 0}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Work'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 