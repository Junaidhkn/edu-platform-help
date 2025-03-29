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
  priceAdjustment: z.coerce
    .number()
    .min(0, {
      message: 'Price adjustment must be at least 0.',
    })
    .max(1000, {
      message: 'Price adjustment must be at most 1000.',
    }),
});

type FormValues = z.infer<typeof formSchema>;

export function NewAssignmentTypeForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: '',
      name: '',
      priceAdjustment: 0,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/services/assignment-types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create assignment type');
      }

      toast.success('Assignment type created successfully');
      router.push('/dashboard/services');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error creating assignment type');
      console.error('Error creating assignment type:', error);
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
                <Input placeholder="e.g. essay" {...field} />
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
                <Input placeholder="e.g. Essay" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="priceAdjustment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price Adjustment</FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <span className="mr-2">$</span>
                  <Input
                    type="number"
                    step="0.5"
                    min="0"
                    max="1000"
                    className="w-32"
                    {...field}
                  />
                  <span className="ml-2">per order</span>
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
            {isSubmitting ? 'Creating...' : 'Create Assignment Type'}
          </Button>
        </div>
      </form>
    </Form>
  );
} 