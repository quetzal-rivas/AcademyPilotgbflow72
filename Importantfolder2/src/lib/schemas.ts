import { z } from 'zod';

export const offeringSchema = z.object({
  name: z.string().min(1, { message: "Offering name can't be empty." }),
  description: z.string().min(1, { message: "Offering description can't be empty." }),
  image: z.string().optional(),
});

export const formSchema = z.object({
  companyInfo: z.object({
    name: z.string().min(2, { message: 'Business name must be at least 2 characters.' }),
    description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
    phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
    hours: z.string().optional(),
    socialLinks: z.array(z.string().url({ message: 'Please enter a valid URL.' })).optional(),
  }),
  media: z.object({
    coverImage: z.string().optional(),
    galleryImages: z.array(z.string()).optional(),
    promotionalVideo: z.string().optional(),
  }),
  offerings: z.array(offeringSchema).optional(),
  slug: z.string().optional(),
  selectedTemplate: z.string().optional(),
  enabledTemplates: z.array(z.string()).optional(),
  isPublic: z.boolean().optional(),
});
