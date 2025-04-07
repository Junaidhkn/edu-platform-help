'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { freelancerFormSchema, FreelancerFormValues } from '@/lib/validators/freelancer-schema';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { UploadButton } from '@/lib/uploadThing';
import { Loader2 } from 'lucide-react';

export default function FreelancerForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const form = useForm<FreelancerFormValues>({
    resolver: zodResolver(freelancerFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      skills: '',
      profileDescription: '',
      profileLink: '',
      imageURI: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: FreelancerFormValues) => {
    try {
      setIsSubmitting(true);
      
      // If an image was uploaded, use that URL
      if (imageUrl) {
        data.imageURI = imageUrl;
      }
      
      const response = await fetch('/api/freelancers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create freelancer');
      }

      toast.success('Freelancer created successfully');
      form.reset();
      setImageUrl('');
    } catch (error) {
      console.error('Error creating freelancer:', error);
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Junaid" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Khan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="freelancer@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+1234567890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="skills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Skills</FormLabel>
              <FormControl>
                <Input placeholder="Research, Writing, Editing, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="profileDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Write a detailed description of the freelancer's experience and qualifications..."
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="profileLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Link (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://linkedin.com/in/username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div>
          <FormLabel>Profile Image (Optional)</FormLabel>
          <div className="mt-2">
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                if (res && res.length > 0) {
                  setImageUrl(res[0].url);
                  form.setValue('imageURI', res[0].url);
                  toast.success('Image uploaded successfully');
                }
              }}
              onUploadError={(error: Error) => {
                toast.error(`Error uploading image: ${error.message}`);
              }}
            />
          </div>
          {imageUrl && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Uploaded image:</p>
              <div className="relative h-40 w-40 rounded-md overflow-hidden">
                <img 
                  src={imageUrl} 
                  alt="Profile" 
                  className="object-cover h-full w-full"
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Freelancer...
            </>
          ) : (
            'Create Freelancer'
          )}
        </Button>
      </form>
    </Form>
  );
} 