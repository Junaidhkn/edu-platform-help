import { z } from 'zod';

export const orderFormSchema = z.object({
  wordCount: z.coerce.number().min(250, {
    message: "Minimum word count is 250 words (1 page)",
  }),
  subject: z.enum(['arts', 'business', 'cs', 'em'], {
    required_error: "Please select a subject",
  }),
  typeCategory: z.enum(['coursework', 'bookreport', 'researchpaper', 'thesis', 'proposal'], {
    required_error: "Please select a type",
  }),
  academicLevel: z.enum(['undergraduate', 'masters', 'phd'], {
    required_error: "Please select an academic level",
  }),
  deadline: z.date({
    required_error: "Please select a deadline date",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters",
  }),
  fileUrls: z.array(z.string()).optional(),
  price: z.coerce.number().min(0),
  totalPrice: z.coerce.number().min(0),
});

export type OrderFormValues = z.infer<typeof orderFormSchema>; 