'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';

const formSchema = z.object({
  id: z.string().min(1, {
    message: 'ID must be at least 1 character.',
  }).regex(/^[a-z0-9-]+$/, {
    message: 'ID must contain only lowercase letters, numbers, and hyphens.',
  }),
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  basePrice: z.coerce
    .number()
    .min(0, {
      message: 'Base price must be at least 0.',
    })
    .max(1000, {
      message: 'Base price must be at most 1000.',
    }),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewAcademicLevelForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: '',
      name: '',
      basePrice: 15,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/services/pricing/academic-levels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create academic level');
      }

      toast.success('Academic level created successfully');
      router.push('/dashboard/services');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error creating academic level');
      console.error('Error creating academic level:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID</FormLabel>
              <FormControl>
                <Input placeholder="e.g. undergraduate" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Undergraduate" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="basePrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Base Price (Per Page)</FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <span className="mr-2">$</span>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1000"
                    className="w-32"
                    {...field}
                  />
                  <span className="ml-2">/ page</span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/services')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Academic Level'}
          </Button>
        </div>
      </form>
    </Form>
  );
} 