import { z } from 'zod';

export const freelancerFormSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  skills: z.string().min(5, { message: "Skills must be at least 5 characters" }),
  profileDescription: z.string().min(20, { message: "Profile description must be at least 20 characters" }),
  profileLink: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
  imageURI: z.string().url({ message: "Please enter a valid image URL" }).optional().or(z.literal('')),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string().min(8, { message: "Confirm password must be at least 8 characters" }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type FreelancerFormValues = z.infer<typeof freelancerFormSchema>; 