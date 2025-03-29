import { z } from 'zod';

export const reviewFormSchema = z.object({
  orderId: z.string().uuid(),
  freelancerId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  reviewText: z.string().min(5, {
    message: "Review text must be at least 5 characters"
  }).max(500, {
    message: "Review text cannot exceed 500 characters"
  }),
});

export type ReviewFormValues = z.infer<typeof reviewFormSchema>; 