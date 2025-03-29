'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ChevronLeft, Loader2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { UploadButton } from '@/lib/uploadThing';

interface SubmitWorkPageProps {
  params: {
    id: string;
  };
}

// Form schema for work submission
const submitWorkSchema = z.object({
  completedFileUrls: z.array(z.string().url()).min(1, {
    message: "Please upload at least one file with your completed work",
  }),
  comments: z.string().optional(),
});

type SubmitWorkFormValues = z.infer<typeof submitWorkSchema>;

export default function SubmitWorkPage({ params }: SubmitWorkPageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const form = useForm<SubmitWorkFormValues>({
    resolver: zodResolver(submitWorkSchema),
    defaultValues: {
      completedFileUrls: [],
      comments: '',
    },
  });

  // Fetch order details and check access
  useEffect(() => {
    const checkAccess = async () => {
      const session = await auth();
      if (!session?.user) {
        redirect('/login');
      }

      try {
        const response = await fetch(`/api/orders/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }

        const orderData = await response.json();
        
        // Check if the freelancer is assigned to this order
        if (orderData.freelancerId !== session.user.id) {
          toast.error('You do not have permission to access this order');
          router.push('/freelancer/orders');
          return;
        }

        // Check if the order is in the right status
        if (orderData.orderStatus !== 'accepted') {
          toast.error('This order cannot be submitted at this time');
          router.push(`/freelancer/orders/${params.id}`);
          return;
        }

        setOrder(orderData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching order:', error);
        toast.error('Failed to load order details');
        router.push('/freelancer/orders');
      }
    };

    checkAccess();
  }, [params.id, router]);

  const onSubmit = async (data: SubmitWorkFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Add the uploaded files to the form data
      data.completedFileUrls = uploadedFiles;
      
      const response = await fetch('/api/orders/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: params.id,
          completedFileUrls: data.completedFileUrls,
          comments: data.comments,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit work');
      }

      toast.success('Work submitted successfully');
      router.push(`/freelancer/orders/${params.id}`);
    } catch (error) {
      console.error('Error submitting work:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit work');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        <div className="flex items-center">
          <Link href={`/freelancer/orders/${params.id}`}>
            <Button variant="ghost" className="mr-4">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Order
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Submit Completed Work</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upload Your Completed Work</CardTitle>
            <CardDescription>
              Upload your completed files and add any comments for the customer.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="completedFileUrls"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload Files</FormLabel>
                      <FormControl>
                        <div className="mb-4">
                          <UploadButton
                            endpoint="pdfUploader"
                            onClientUploadComplete={(res) => {
                              if (res && res.length > 0) {
                                const newFiles = res.map(file => file.url);
                                const updatedFiles = [...uploadedFiles, ...newFiles];
                                setUploadedFiles(updatedFiles);
                                field.onChange(updatedFiles);
                                toast.success(`${res.length} file(s) uploaded successfully`);
                              }
                            }}
                            onUploadError={(error: Error) => {
                              toast.error(`Error uploading file: ${error.message}`);
                            }}
                          />
                        </div>
                      </FormControl>
                      {uploadedFiles.length > 0 && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-md">
                          <p className="font-medium mb-2">Uploaded Files:</p>
                          <ul className="list-disc list-inside space-y-1">
                            {uploadedFiles.map((file, index) => (
                              <li key={index} className="flex items-center justify-between">
                                <a
                                  href={file}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  File {index + 1}
                                </a>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const newFiles = [...uploadedFiles];
                                    newFiles.splice(index, 1);
                                    setUploadedFiles(newFiles);
                                    field.onChange(newFiles);
                                  }}
                                >
                                  Remove
                                </Button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <FormDescription>
                        Upload all files related to your completed work. Supported formats include PDF, DOC, DOCX, and images.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="comments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comments (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add any comments or notes for the customer..."
                          rows={5}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide any additional information about your completed work.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isSubmitting || uploadedFiles.length === 0}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Submit Completed Work
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col items-start">
            <p className="text-sm text-gray-500">
              Note: Once submitted, your work will be sent to the customer for review.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 